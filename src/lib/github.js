import sgit from 'simple-git'

async function getSHA(params) {
  const {github, token, branch, fileName, octokit} = params

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

  const git = sgit()
  const sha = await git.hashObject(fileName)
  
  return sha
}

module.exports = {
  getSHA
}