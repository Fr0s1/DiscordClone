async function files(parent, args, context) {
    let FILE_SERVER_ENDPOINT = process.env.FILE_SERVER_ENDPOINT

    /*
    Because query information is a JSON format so switching to POST request is easier to handle
    */
    const files = await context.axios.post(`${FILE_SERVER_ENDPOINT}/message/files`, {
        messageId: parent._id,
        files: parent.files
    })

    return files.data
}

async function sender(parent, args, context) {
    const User = context.mongo.User

    let sender = await User.findOne({
        _id: parent.sender._id
    })

    return sender
}

async function receiver(parent, args, context) {
    const User = context.mongo.User

    let receiver = await User.findOne({
        _id: parent.receiver._id
    })

    return receiver
}

module.exports = {
    files,
    sender,
    receiver
}