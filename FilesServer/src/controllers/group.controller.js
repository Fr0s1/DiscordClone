const s3 = require('../aws/s3')
const redisClient = require('../redis/redisClient')

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

    try {
        const putResult = await s3.putObject(destparams).promise();
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: "Can't upload group avatar at the moment"
        })
    }

    try {
        let groupAvatarRedisKey = `groups:${groupId}:avatar`

        const result = await s3.getSignedUrlPromise('getObject', {
            Bucket: BucketName,
            Key: destparams.Key,
            Expires: parseInt(process.env.redisKeyExpireTime)
        })

        redisClient.setexAsync(groupAvatarRedisKey, parseInt(process.env.redisKeyExpireTime), result)

        res.json({
            groupAvatar: result
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            error: "Can't get group avatar url"
        })
    }
}

exports.getGroupAvatar = async (req, res) => {
    let groupId = req.params.groupId
    const Bucket = process.env.BUCKET_NAME
    const listParams = {
        Bucket,
        Prefix: `groups/${groupId}/avatar/`
    };
    const listedObjects = await s3.listObjectsV2(listParams).promise();

    let contentLength = listedObjects.Contents.length

    if (contentLength == 0) {
        res.json({
            groupAvatar: " "
        })
    } else {
        let groupAvatarRedisKey = `groups:${groupId}:avatar`

        if (await redisClient.existsAsync(groupAvatarRedisKey)) {
            let result = await redisClient.getAsync(groupAvatarRedisKey)

            console.log(`Group ${groupId} avatar is cached`)
            res.json({
                groupAvatar: result
            })
        } else {
            let avatarUrl = await s3.getSignedUrlPromise('getObject', {
                Bucket,
                Key: listedObjects.Contents[0].Key,
                Expires: parseInt(process.env.redisKeyExpireTime)
            })

            redisClient.setex(groupAvatarRedisKey, parseInt(process.env.redisKeyExpireTime), avatarUrl)

            res.json({
                groupAvatar: avatarUrl
            })
        }
    }
}