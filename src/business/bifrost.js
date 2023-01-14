const {getObjects, readObjectBody} = require('../lib/aws-sdk')

async function getBifrostConfigVersion() {
  const files = await getObjects({Prefix: "/bifrost"})
  const fileContents = files.Contents
  let bodyContent

  for (let i = 0; i < fileContents.length; i++) {
    if (fileContents[i].Key === "bifrost/version") {
      const body = await readObjectBody(fileContents[i])
      bodyContent = body.toString()

      break
    }
  }

  return bodyContent
}

function getBifrostSyncVersionNumber(version) {
  return parseInt(version.replace('.', ''))
}

async function getBifrostSyncVersionNumber (actionCore, github) {
  const bifrostConfigVersion = getVersionNumber(await getBifrostConfigVersion())
  console.log(`Current Bifrost Sync version: ${bifrostConfigVersion}`)
  
  const repoConfigVersion = getVersionNumber(actionCore.getInput("bifrost-version"))
  console.log(`Last Repository Synched version: ${repoConfigVersion}`)

  if (bifrostConfigVersion > repoConfigVersion) {
    console.log("Your config version is outdated")
  } else if (bifrostConfigVersion === repoConfigVersion) {
    console.log("Your config version is updated")
  } else {
    console.log("Ops, your config version is weird...")
  }
  
  // const token = core.getInput('token')
  // const dryrun = core.getBooleanInput('dryrun')

  // const committer = {
  //   commit: true,
  //   branch: "master",
  //   sha: undefined,
  // }

  // const octokit = github.getOctokit(token)
  // console.log('Committer REST API', 'ok')
  // try {
  //   console.log('Committer account', (await octokit.rest.users.getAuthenticated()).data.login)
  // } catch {
  //   console.log('Committer account', '(github-actions)')
  // }

  // console.log('Using branch', committer.branch)
  

  // try {
  //   const {
  //     repository: {
  //       object: { oid },
  //     },
  //   } = await octokit.graphql(
  //     `
  //     query Sha {
  //       repository(owner: "${github.context.repo.owner}", name: "${github.context.repo.repo}") {
  //         object(expression: "${committer.branch}:.github/version") { ... on Blob { oid } }
  //       }
  //     }
  //   `,
  //     { headers: { authorization: `token ${token}` } },
  //   )
  //   committer.sha = oid
  // } catch (error) {
  //   console.debug(error)
  // }
  // console.log('Previous render sha', committer.sha ?? '(none)')
}

module.exports = {
  getBifrostSyncVersionNumber
}