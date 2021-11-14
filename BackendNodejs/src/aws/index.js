const AWS = require('aws-sdk')

const cognitoConfig = {
    region: 'ap-southeast-1',
}

const bucketName = process.env.BUCKET_NAME

const s3Config = {
    params: { Bucket: bucketName },
    region: 'ap-southeast-1'
}

let env = process.env.ENV

if (env === "DOCKER") {
    let acccessKeyId = process.env.accessKeyId
    let secretAccessKey = process.env.secretAccessKey

    s3Config.accessKeyId = acccessKeyId
    s3Config.secretAccessKey = secretAccessKey

    cognitoConfig.accessKeyId = acccessKeyId
    cognitoConfig.secretAccessKey = secretAccessKey
}

console.log(s3Config)
console.log(cognitoConfig)

const s3 = new AWS.S3(s3Config);

const cognitoClient = new AWS.CognitoIdentityServiceProvider(cognitoConfig)

const aws = {
    s3,
    cognitoClient,
    emptyS3Directory
}

async function emptyS3Directory(bucket, dir) {
    const listParams = {
        Bucket: bucket,
        Prefix: dir
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir)
}

module.exports = aws
