const redisClient = require('../redis/redisClient')

exports.getMessageFilesUrls = async (req, res) => {
    let files = req.body.files
    let messageId = req.body.messageId
    let BucketName = process.env.BUCKET_NAME

    const s3 = require('../aws/s3')
    for (let file of files) {
        const destparams = {
            Bucket: BucketName,
            Key: `message/${messageId}/${file.fileName}`,
            Expires: parseInt(process.env.redisKeyExpireTime)
        };
        
        let redisMessageId = `message:${messageId}`

        if (await redisClient.hexistsAsync(redisMessageId, file.fileName)) {
            let fileUrl = await redisClient.hgetAsync(redisMessageId, file.fileName)
            console.log(`Message ${messageId} files urls are cached`)
            file.fileUrl = fileUrl
        } else {
            const result = await s3.getSignedUrlPromise('getObject', destparams)

            await redisClient.hsetAsync(redisMessageId, file.fileName, result)

            await redisClient.expireAsync(redisMessageId, parseInt(process.env.redisKeyExpireTime))
            file.fileUrl = result
        }
    }

    res.json(files)
}