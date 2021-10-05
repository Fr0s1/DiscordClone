const s3 = require('../aws/s3')

exports.uploadGroupAvatar = async (req, res) => {
    var multer = require('multer')

    upload = multer()

    let groupId = req.body.groupId

    let file = req.file

    let BucketName = process.env.BUCKET_NAME

    const destparams = {
        Bucket: BucketName,
        Key: `groups/${groupId}/avatar/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentEncoding: file.encoding
    };

    // const putResult = await s3.putObject(destparams).promise();

    // const result = await s3.getSignedUrlPromise('getObject', {
    //     Bucket: BucketName,
    //     Key: destparams.Key,
    //     Expires: 3600
    // })

    res.send(" ")
}

exports.getGroupAvatar = async (req, res) => {
    const Bucket = process.env.BUCKET_NAME
    const listParams = {
        Bucket,
        Prefix: `groups/${req.params.groupId}/avatar/`
    };
    // const listedObjects = await s3.listObjectsV2(listParams).promise();

    let contentLength = listedObjects.Contents.length
    if (contentLength == 0) {
        res.json({
            groupAvatar: " "
        })
    } else {
        // let avatarUrl = await s3.getSignedUrlPromise('getObject', {
        //     Bucket,
        //     Key: listedObjects.Contents[0].Key,
        //     Expires: 7200
        // })

        res.json({
            groupAvatar: " "
        })
    }
}