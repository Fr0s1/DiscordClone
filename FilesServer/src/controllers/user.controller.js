const s3 = require('../aws/s3')

exports.uploadUserAvatar = async (req, res) => {
    var multer = require('multer')

    upload = multer()

    const username = req.body.username
    const file = req.file

    let BucketName = process.env.BUCKET_NAME

    const destparams = {
        Bucket: BucketName,
        Key: `users/${username}/avatar/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.fileType,
        ContentEncoding: file.encoding
    };
    const putResult = await s3.putObject(destparams).promise();

    const result = await s3.getSignedUrlPromise('getObject', {
        Bucket: BucketName,
        Key: destparams.Key,
        Expires: 7200
    })

    res.send(result)
}

exports.getUserAvatarUrl = async (req, res) => {
    const Bucket = process.env.BUCKET_NAME
    const listParams = {
        Bucket,
        Prefix: `users/${req.params.username}/avatar/`
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length == 0) {
        res.json({
            avatar: ""
        })
    } else {
        let avatarUrl = await s3.getSignedUrlPromise('getObject', {
            Bucket,
            Key: listedObjects.Contents[0].Key,
            Expires: 3600
        })

        res.json({
            avatar: avatarUrl
        })
    }
}