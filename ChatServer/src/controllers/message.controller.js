const crypto = require("crypto");
const redisClient = require('../redis/redisClient')

exports.saveMessage = async (req, res) => {
    const BucketName = process.env.BUCKET_NAME

    const { Message, User } = require('../models')

    const s3 = require('../aws/s3')

    // Files array to store info of file in MongoDB (without file Urls)
    let files = []

    // File Urls Array to be sent back to sender by Socket.io
    let fileUrls = []

    // Get sender information
    let sender = await User.findOne({
        username: req.body.sender
    })

    // Get receiver information
    let receiver = await User.findOne({
        username: req.body.receiver
    })

    const newMessage = {
        sender: sender._id,
        receiver: receiver._id,
        content: req.body.content
    }

    // Check if the message has any files
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

    let savedMessage = await Message.create(newMessage)

    // Get signed url from s3 to send back to Client
    for (let i = 0; i < newMessage.files.length; i++) {
        const destparams = {
            Bucket: BucketName,
            Key: `message/${savedMessage._id}/${savedMessage.files[i].fileName}`,
            Body: req.files[i].buffer,
            ContentType: req.files[i].fileType,
            ContentEncoding: req.files[i].encoding
        };

        const putResult = await s3.putObject(destparams).promise();

        const result = await s3.getSignedUrlPromise('getObject', {
            Bucket: BucketName,
            Key: destparams.Key,
            Expires: 3600
        })

        let redisMessageId = `message:${savedMessage._id}`

        redisClient.hsetAsync(redisMessageId, savedMessage.files[i].fileName, result)

        redisClient.expireAsync(redisMessageId, parseInt(process.env.redisKeyExpireTime))

        // const result = " "

        fileUrls.push({
            fileName: newMessage.files[i].fileName,
            fileUrl: result,
            fileType: req.files[i].mimetype
        })
    }

    let messageReturnedToClient = {
        _id: savedMessage._id,
        sender: {
            username: req.body.sender
        },
        receiver: {
            username: req.body.receiver
        },
        content: savedMessage.content,
        markedDeletedByReceiver: savedMessage.markedDeletedByReceiver,
        markedDeletedBySender: savedMessage.markedDeletedBySender,
        files: fileUrls,
        sentTime: savedMessage.sentTime
    }

    res.send(messageReturnedToClient)
}