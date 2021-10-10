const redisClient = require('../redis/redisClient')

exports.getMessageFilesUrls = async (req, res) => {
    let files = req.body.files
    let messageId = req.body.messageId
    let BucketName = process.env.BUCKET_NAME

    let redisMessageId = `groupmessage:${messageId}`
    
    const s3 = require('../aws/s3')

    for (let file of files) {
        const destparams = {
            Bucket: BucketName,
            Key: `groupmessage/${messageId}/${file.fileName}`,
            Expires: parseInt(process.env.redisKeyExpireTime)
        }

        // Check if the file's url are cached
        if (await redisClient.hexistsAsync(redisMessageId, file.fileName)) {
            let fileUrl = await redisClient.hgetAsync(redisMessageId, file.fileName)
            console.log(`Group message ${messageId} file urls are cached`)
            file.fileUrl = fileUrl
        } else {
            // Get file url from s3
            const result = await s3.getSignedUrlPromise('getObject', destparams)

            // Then cached the url in redis
            await redisClient.hsetAsync(redisMessageId, file.fileName, result)

            // Set key expire time
            await redisClient.expireAsync(redisMessageId, parseInt(process.env.redisKeyExpireTime))

            file.fileUrl = result
        }
    }

    res.json(files)
}