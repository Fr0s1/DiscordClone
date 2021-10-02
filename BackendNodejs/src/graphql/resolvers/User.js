async function friendlist(parent, args, context) {
    const User = context.mongo.User

    // Populate a user's friends information 
    const result = await User.findOne({
        username: parent.username
    }).populate('friendlist').select({ "friendlist": 1, "_id": 0 })
    return result.friendlist
}

async function contactlist(parent, args, context) {
    const User = context.mongo.User

    // Populate a user's current chat list information
    const result = await User.findOne({
        username: parent.username
    }).populate('contactlist').select({ "contactlist": 1, "_id": 0 })
    return result.contactlist
}

async function groups(parent, args, context) {
    const User = context.mongo.User

    // Populate a user's current group chat list information
    const result = await User.findOne({
        username: parent.username
    }).populate('groups').select({ "groups": 1, "_id": 0 })
    return result.groups
}

async function avatar(parent, args, context) {
    let username = parent.username

    const axios = context.axios

    let FILE_SERVER_ENDPOINT = process.env.FILE_SERVER_ENDPOINT
    let result = await axios.get(`${FILE_SERVER_ENDPOINT}/users/avatar/${username}`)
    
    return result.data.avatar
}

module.exports = {
    friendlist,
    contactlist,
    groups,
    avatar
}