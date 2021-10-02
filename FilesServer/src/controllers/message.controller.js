exports.getMessageFilesUrls = async (req, res) => {
    let files = req.body.files
    let messageId = req.body.messageId
    let BucketName = process.env.BUCKET_NAME

    const s3 = require('../aws/s3')
    for (file of files) {
        const destparams = {
            Bucket: BucketName,
            Key: `message/${messageId}/${file.fileName}`,
            Expires: 3600
        };

        const result = await s3.getSignedUrlPromise('getObject', destparams)

        file.fileUrl = result
    }

    res.json(files)

}