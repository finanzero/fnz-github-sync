const {getObjects, readObjectBody} = require('../lib/aws-sdk')
const { getSHA, upsertFileContents } = require('../lib/github')

async function getBifrostFiles() {
  const files = await getObjects({Prefix: "bifrost/"})
  const fileContents = files.Contents

  return fileContents
}

async function getBifrostSyncVersionNumber (actionCore, github) {
  const owner = "finanzero"
  const token = actionCore.getInput('token')
  const repositories = actionCore.getInput('bifrost-repositories').split('|')

  const committer = {
    commit: true,
    branch: "master",
    sha: undefined,
  }

  const octokit = github.getOctokit(token)
  console.log('Committer REST API', 'ok')

  try {
    console.log('Committer account', (await octokit.rest.users.getAuthenticated()).data.login)
  } catch {
    console.log('Committer account', '(github-actions)')
  }
  
  const files = await getBifrostFiles()

  for (let k = 0; k < repositories.length; k++) {
    const repositoryName = repositories[k];

    try {
      console.log(`Starting update on ${repositoryName}`)

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (
          file.Key !== "bifrost/"
          && file.Key !== "bifrost/version"
        ) {
          const fileName = file.Key.replace('bifrost/', '')
          const body = await readObjectBody(file)
          const sha = await getSHA({
            owner,
            token,
            branch: committer.branch,
            fileName,
            repositoryName,
            fileContent: body.toString(),
            octokit,
          })
  
          await upsertFileContents({
            owner,
            fileName,
            repositoryName,
            fileBody: body.toString('base64'),
            branch: committer.branch,
            sha,
            createOrUpdateFileContents: octokit.rest.repos.createOrUpdateFileContents
          })
        }
      }
    } catch (error) {
      console.error(`Error on updating ${repositoryName}`, error)
    }
    
  }
}

module.exports = {
  getBifrostSyncVersionNumber
}