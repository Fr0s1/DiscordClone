const { User, Group } = require('../schemas')

exports.ifInContactList = async (firstUser, secondUser) => {
    let secondUserInfo = await User.findOne({
        username: secondUser
    })

    let firstUserContactList = await User.findOne({
        username: firstUser
    }).select("contactlist");

    return firstUserContactList.contactlist.includes(secondUserInfo._id)
}

exports.ifUserInGroupWithId = async (groupId, username) => {
    let userGroupsList = await User.findOne({
        username
    }).select("groups")

    console.log(userGroupsList)
    return userGroupsList.groups.includes(groupId)
}