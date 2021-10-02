exports.uploadGroupAvatar = async (req, res) => {
    var multer = require('multer')

    upload = multer()
    const { User } = require('../models')

    const username = req.body.username
    const file = req.file

    const s3 = require('../aws/s3')

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
        Expires: 3600
    })

    res.send(result)
}