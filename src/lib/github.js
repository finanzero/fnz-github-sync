const sgit = require('simple-git')
const fs = require('fs/promises')
const path = require('path')

async function getSHA(params) {
  const {owner, token, repositoryName, branch, fileName, fileContent, octokit} = params

  const { repository } = await octokit.graphql(
    `
    query Sha {
      repository(owner: "${owner}", name: "${repositoryName}") {
        object(expression: "${branch}:${fileName}") { ... on Blob { oid } }
      }
    }
  `,
    { headers: { authorization: `bearer ${token}` } },
  )

  if (repository) {
    if (repository.object) {
      return repository.object.oid
    }
  }

  try {
    if (fileName.split('/').length > 1) {
      await fs.mkdir(path.dirname(fileName), { recursive: true })
    } 

    await fs.writeFile(fileName, fileContent);
  } catch (err) {
    console.error(err);
  }

  const git = sgit()
  const sha = await git.hashObject(fileName)
  
  return sha
}

async function upsertFileContents(params) {
  const {owner, repositoryName, fileName, fileBody, branch, sha, createOrUpdateFileContents} = params

  const result = await createOrUpdateFileContents({
    owner,
    repo: repositoryName,
    path: `.github/${fileName}`,
    message: `updating ${fileName}`,
    content: fileBody.toString('base64'),
    branch,
    ...(sha ? {sha} : {})
  })

  console.log(`${repositoryName} - ${fileName} updated`, result)
} 

module.exports = {
  getSHA,
  upsertFileContents,
}