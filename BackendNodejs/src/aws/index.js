const AWS = require('aws-sdk')

const cognitoConfig = {
    region: 'ap-southeast-1',
}

const bucketName = process.env.BUCKET_NAME

const s3 = new AWS.S3({ params: { Bucket: bucketName } });

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
