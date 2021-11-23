const AWS = require('aws-sdk')

const bucketName = process.env.BUCKET_NAME

const s3Config = {
    params: { Bucket: bucketName },
    region: process.env.region
}

let env = process.env.ENV

if (env === "DOCKER") {
    let acccessKeyId = process.env.accessKeyId
    let secretAccessKey = process.env.secretAccessKey

    s3Config.accessKeyId = acccessKeyId
    s3Config.secretAccessKey = secretAccessKey
}

const s3 = new AWS.S3(s3Config);

module.exports = s3