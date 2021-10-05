const AWS = require('aws-sdk')

const bucketName = 'frost-image'

const s3 = new AWS.S3({ params: { Bucket: bucketName } });

module.exports = s3