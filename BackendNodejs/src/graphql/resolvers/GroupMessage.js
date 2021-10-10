async function sender(parent, args, context) {
    const User = context.mongo.User

    let sender = await User.findOne({
        _id: parent.sender._id
    })

    return sender
}

async function group(parent, args, context) {
    const Group = context.mongo.Group

    let group = await Group.findOne({
        _id: parent.group._id
    })

    return group
}

async function files(parent, args, context) {
    let FILE_SERVER_ENDPOINT = process.env.FILE_SERVER_ENDPOINT

    /*
    Because query information is a JSON format so switching to POST request is easier to handle
    */
    const files = await context.axios.post(`${FILE_SERVER_ENDPOINT}/groupmessage/files`, {
        messageId: parent._id,
        files: parent.files
    })

    return files.data
}

module.exports = {
    sender,
    group,
    files
}