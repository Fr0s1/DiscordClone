async function friendlist(parent, args, context) {
    const User = context.mongo.User

    const result = await User.findOne({
        username: parent.username
    }).populate('friendlist').select({"friendlist": 1, "_id": 0})
    return result.friendlist
}

async function contactlist(parent, args, context) {
    const User = context.mongo.User

    const result = await User.findOne({
        username: parent.username
    }).populate('contactlist').select({"contactlist": 1, "_id": 0})
    return result.contactlist
}

module.exports = {
    friendlist,
    contactlist
}