const {getObjects, readObjectBody} = require('../lib/aws-sdk')

async function getBifrostConfigVersion() {
  const files = await getObjects({Prefix: "bifrost/"})
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

function getVersionNumber(version) {
  return version.split('.')
}

function isOutdated(current, old) {
  if (
    current[0] > old[0]
    || current[1] > old[1]
    || current[2] > old[2]
  ) {
    console.log("Your config version is outdated")
    return true
  } else if (current.join('.') === old.join('.')) {
    console.log("Your config version is updated")
    return false
  } else {
    console.log("Ops, your config version is weird...")
    return false
  }
}

async function getBifrostSyncVersionNumber (actionCore, github) {
  const bifrostConfigVersion = await getBifrostConfigVersion()
  console.log(`Current Bifrost Sync version: ${bifrostConfigVersion}`)
  
  const repoConfigVersion = actionCore.getInput("bifrost-version")
  console.log(`Last Repository Synched version: ${repoConfigVersion}`)

  const outdated = isOutdated(
    getVersionNumber(bifrostConfigVersion), 
    getVersionNumber(repoConfigVersion)
  )

  
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