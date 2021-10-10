const s3 = require('../aws/s3')
const redisClient = require('../redis/redisClient')

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

    let redisUserAvatarKey = `users:${username}:avatar`

    const putResult = await s3.putObject(destparams).promise();

    const avatar = await s3.getSignedUrlPromise('getObject', {
        Bucket: BucketName,
        Key: destparams.Key,
        Expires: parseInt(process.env.redisKeyExpireTime)
    })

    // Cached user avatar url in redis for next request
    // and set key expire time equal s3 url time
    redisClient.setexAsync(redisUserAvatarKey, parseInt(process.env.redisKeyExpireTime), avatar)

    // const result = " "
    res.json({
        avatar 
    })
}

exports.getUserAvatarUrl = async (req, res) => {
    const Bucket = process.env.BUCKET_NAME

    let username = req.params.username
    const listParams = {
        Bucket,
        Prefix: `users/${username}/avatar/`
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    let contentLength = listedObjects.Contents.length
    if (contentLength == 0) {
        res.json({
            avatar: ""
        })
    } else {
        let redisUserAvatarKey = `users:${username}:avatar`

        // Check if avatar url is cached?
        if (await redisClient.existsAsync(redisUserAvatarKey)) {
            let avatar = await redisClient.getAsync(redisUserAvatarKey)

            console.log(`Avatar of user ${username} is cached`)

            res.json({
                avatar
            })
        } else {
            let avatar = await s3.getSignedUrlPromise('getObject', {
                Bucket,
                Key: listedObjects.Contents[0].Key,
                Expires: 3600
            })

            redisClient.setexAsync(redisUserAvatarKey, parseInt(process.env.redisKeyExpireTime), avatar)

            res.json({
                avatar
            })
        }
    }

    // let avatarUrl = " "
    // res.json({
    //     avatar: avatarUrl
    // })
}

exports.deleteUserAvatar = async (req, res) => {
    const Bucket = process.env.BUCKET_NAME

    let username = req.params.username

    const listParams = {
        Bucket,
        Prefix: `users/${username}/avatar/`
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    let contentLength = listedObjects.Contents.length
    if (contentLength == 0) {
        res.json({
            avatar: ""
        })
    } else {
        try {
            let avatarUrl = await s3.deleteObject({
                Bucket,
                Key: listedObjects.Contents[0].Key,
            }).promise()
            let redisUserAvatarKey = `users:${username}:avatar`

            redisClient.delAsync(redisUserAvatarKey)

            res.send({
                message: 'Delete user avatar successfully'
            })
        } catch (e) {
            res.send({
                error: e
            })
        }
    }
}