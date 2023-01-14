const sgit = require('simple-git')
const fs = require('fs/promises')
const path = require('path')

async function getSHA(params) {
  const {github, token, branch, fileName, fileContent, octokit} = params

  const { repository } = await octokit.graphql(
    `
    query Sha {
      repository(owner: "${github.context.repo.owner}", name: "${github.context.repo.repo}") {
        object(expression: "${branch}:${fileName}") { ... on Blob { oid } }
      }
    }
  `,
    { headers: { authorization: `token ${token}` } },
  )

  if (repository) {
    if (repository.object) {
      return repository.object.oid
    }
  }

  try {
    await fs.writeFile(fileName, fileContent);
  } catch (err) {
    console.error(err);
  }

  const git = sgit()
  const sha = await git.hashObject(fileName)
  
  return sha
}

module.exports = {
  getSHA
}