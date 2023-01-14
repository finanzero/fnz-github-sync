const core    = require('@actions/core')
const github  = require('@actions/github')
const { S3 } = require('aws-sdk')

/**
 * S3 parameters for query on bucket
 * @type {Object}
 * @property {string} Bucket
 * @property {string|null} Delimeter
 * @property {string|null} EncodingType
 * @property {string|null} ExpectedBucketOwner
 * @property {string|null} Marker
 * @property {string|null} MaxKeys
 * @property {string|null} Prefix
 */
const S3DefaultParams = {
  "Bucket": "repositories.finanzero.com.br",
}

const s3 = new S3()

/**
 * Get all objects from bucket
 * @returns {Promise<AWSS3ObjectList>}
 */
async function getObjects() {
  return new Promise((res, rej) => {
    try {
      s3.listObjects({...S3DefaultParams, "Prefix": "bifrost/"}, (err, data) => {
        if (err) {
          throw err
        } else {
          res(data)
        }
      })
    } catch (error) {
      console.error(error)
      rej([])
    }
  })
}

/**
 * Read a AWS S3 Object
 * @param {AWSS3Object} file 
 */
async function readObjectBody(file) {
  return new Promise((res, rej) => {
    try {
      s3.getObject({...S3DefaultParams, Key: file.Key}, (err, data) => {
        if (err) {
          throw err
        } else {
          res(data.Body)
        }
      })
    } catch (error) {
      console.error(error)
      rej(null)
    }
  })
}

async function getBifrostConfigVersion() {
  const files = await getObjects()
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

(async () => {
  // const token = core.getInput('token')
  // const branch = core.getInput('commit_branch')
  // const message = core.getInput('commit_message')
  // const filename = core.getInput('commit_filename')
  // const dryrun = core.getBooleanInput('dryrun')

  const bifrostConfigVersion = await getBifrostConfigVersion()
  
  console.log(bifrostConfigVersion)
})()

/**
 * @typedef AWSS3ObjectList
 * @type {Object}
 * 
 * @property {AWSS3Object[]}  Contents
 * @property {string}         NextMarker
 */

/**
 * @typedef AWSS3Object
 * @type {Object}
 * 
 * @property {string} ETag
 * @property {string} Key
 * @property {Date}   LastModified
 * @property {Object} Owner
 * @property {string} Owner.DisplayName
 * @property {string} Owner.ID
 * @property {number} Size
 * @property {string} StorageClass
 */