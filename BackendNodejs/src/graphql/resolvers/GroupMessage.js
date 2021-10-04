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
        _id: parent._id
    })

    return group
}

module.exports = {
    sender,
    group
}