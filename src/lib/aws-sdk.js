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
 * @param {Object} params
 * @param {string} params.Prefix
 * @returns {Promise<AWSS3ObjectList>}
 */
async function getObjects(params) {
  params = {...S3DefaultParams, ...params}

  return new Promise((res, rej) => {
    try {
      s3.listObjects(params, (err, data) => {
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
  const params = {...S3DefaultParams, Key: file.Key}

  return new Promise((res, rej) => {
    try {
      s3.getObject(params, (err, data) => {
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

module.exports = {
  getObjects,
  readObjectBody,
}