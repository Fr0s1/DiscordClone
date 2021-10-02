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

async function getFileUrlsOfMessage(bucket, message) {
    let BucketName = process.env.BUCKET_NAME
    for (file of message.files) {
        const destparams = {
            Bucket: BucketName,
            Key: `message/${message._id}/${file.fileName}`,
            Expires: 3600
        };

        const result = await s3.getSignedUrlPromise('getObject', destparams)

        file.fileUrl = result
        console.log(result)
    }
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
