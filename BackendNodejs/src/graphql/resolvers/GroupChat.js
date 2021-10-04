async function admin(parent, args, context) {
    let User = context.mongo.User

    let admin = await User.findOne({
        _id: parent.admin
    })
    
    return admin
}

async function members(parent, args, context) {
    let Group = context.mongo.Group
    let User = context.mongo.User

    let adminFound = await User.findOne({
        _id: parent.admin
    })

    let data = await Group.findOne({
        admin: adminFound._id,
        groupName: parent.groupName
    }).populate('members').select({"members": 1})

    return data.members
}

async function groupAvatar(parent, args, context) {
    let groupId = parent._id

    const axios = context.axios

    let FILE_SERVER_ENDPOINT = process.env.FILE_SERVER_ENDPOINT
    // Get group avatar url
    let result = await axios.get(`${FILE_SERVER_ENDPOINT}/groups/${groupId}/avatar`)
    
    return result.data.groupAvatar
}

module.exports = {
    admin,
    members,
    groupAvatar
}