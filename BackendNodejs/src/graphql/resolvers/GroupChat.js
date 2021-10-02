async function admin(parent, args, context) {
    let User = context.mongo.User

    let admin = await User.findOne({
        _id: parent.admin
    })
    
    console.log(admin)
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

    console.log(data.members)
    return data.members
}

module.exports = {
    admin,
    members
}