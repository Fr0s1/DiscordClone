const AWS = require('aws-sdk')

const bucketName = process.env.BUCKET_NAME

const s3 = new AWS.S3({ params: { Bucket: bucketName } });

module.exports = s3