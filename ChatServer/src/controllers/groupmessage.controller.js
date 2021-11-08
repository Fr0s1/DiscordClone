const crypto = require("crypto");
const redisClient = require('../redis/redisClient')
const axios = require('axios')

exports.saveMessage = async (req, res) => {
    const BucketName = process.env.BUCKET_NAME

    const { GroupMessage, User } = require('../models')

    const s3 = require('../aws/s3')

    // Files array to store info of file in MongoDB (without file Urls)
    let files = []

    // File Urls to be sent by Socket.io
    let fileUrls = []

    let sender = await User.findOne({
        username: req.body.sender.trim()
    })

    const newMessage = {
        sender: sender._id,
        group: req.body.group,
        content: req.body.content,
    }

    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            const id = crypto.randomBytes(16).toString("hex");

            let newFile = {
                fileType: file.mimetype,
                fileName: id + '_' + file.originalname
            }
            files.push(newFile)
        })
    }

    newMessage.files = files

    let savedMessage = await GroupMessage.create(newMessage)
    let FILE_SERVER_ENDPOINT = process.env.FILE_SERVER_ENDPOINT
    let result = await axios.get(`${FILE_SERVER_ENDPOINT}/users/${savedMessage.sender}/avatar`)

    console.log(savedMessage)
    // Get signed url from s3 to send back to Client
    for (let i = 0; i < newMessage.files.length; i++) {
        const destparams = {
            Bucket: BucketName,
            Key: `groupmessage/${savedMessage._id}/${savedMessage.files[i].fileName}`,
            Body: req.files[i].buffer,
            ContentType: req.files[i].fileType,
            ContentEncoding: req.files[i].encoding
        };

        const putResult = await s3.putObject(destparams).promise();

        const result = await s3.getSignedUrlPromise('getObject', {
            Bucket: BucketName,
            Key: destparams.Key,
            Expires: parseInt(process.env.redisKeyExpireTime)
        })

        let redisMessageId = `groupmessage:${savedMessage._id}`

        redisClient.hsetAsync(redisMessageId, savedMessage.files[i].fileName, result)

        redisClient.expireAsync(redisMessageId, parseInt(process.env.redisKeyExpireTime))

        fileUrls.push({
            fileName: newMessage.files[i].fileName,
            fileUrl: result,
            fileType: req.files[i].mimetype
        })
    }

    let messageReturnedToClient = {
        _id: savedMessage._id,
        sender: {
            username: savedMessage.sender,
            avatar: result.data.avatar
        },
        group: savedMessage.group,
        content: savedMessage.content,
        fileUrls,
        sentTime: savedMessage.sentTime
    }

    res.send(messageReturnedToClient)
}