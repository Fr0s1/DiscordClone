exports.saveMessage = async (req, res) => {
    const BucketName = process.env.BUCKET_NAME

    const { Message, User } = require('../models')

    const s3 = require('../aws/s3')

    // Files array to store info of file in MongoDB (without file Urls)
    let files = []

    // File Urls to be sent by Socket.io
    let fileUrls = []

    let sender = await User.findOne({
        username: req.body.sender
    })

    let receiver = await User.findOne({
        username: req.body.receiver
    })

    const newMessage = {
        sender: sender._id,
        receiver: receiver._id,
        content: req.body.content,
    }

    let savedMessage

    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            let newFile = {
                fileType: file.mimetype,
                fileName: file.originalname
            }
            files.push(newFile)
        })

        newMessage.files = files

        // Get signed url from s3 to send back to Client
        for (let file of req.files) {
            const destparams = {
                Bucket: BucketName,
                Key: `message/${savedMessage._id}/${file.originalname}`,
                Body: file.buffer,
                ContentType: file.fileType,
                ContentEncoding: file.encoding
            };

            // const putResult = await s3.putObject(destparams).promise();

            // const result = await s3.getSignedUrlPromise('getObject', {
            //     Bucket: BucketName,
            //     Key: destparams.Key,
            //     Expires: 3600
            // })

            const result = " "

            fileUrls.push({
                fileName: file.originalname,
                fileUrl: result,
                fileType: file.mimetype
            })
        }
    }

    savedMessage = await Message.create({ ...newMessage, files })

    let messageReturnedToClient = {
        _id: savedMessage._id,
        sender: savedMessage.sender,
        receiver: savedMessage.receiver,
        content: savedMessage.content,
        markedDeletedByReceiver: savedMessage.markedDeletedByReceiver,
        markedDeletedBySender: savedMessage.markedDeletedBySender,
        fileUrls,
        sentTime: savedMessage.sentTime
    }

    res.send(messageReturnedToClient)
}