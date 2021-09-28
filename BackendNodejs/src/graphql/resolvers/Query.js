async function user(parent, args, context) {
    const User = context.mongo.User

    let result = await User.findOne({
        username: args.username
    }).populate('friendlist').populate('contactlist')

    return result
}

async function group(parent, args, context) {
    const Group = context.mongo.Group
    const User = context.mongo.User

    let adminFound = await User.findOne({
        username: args.admin
    })

    if (adminFound) {
        let result = await Group.findOne({
            admin: adminFound._id,
            groupName: args.groupName
        }).populate('admin').populate('members')

        return result
    } else {
        throw new Error('Admin for this group does not exists')
    }
}

module.exports = {
    user,
    group
}