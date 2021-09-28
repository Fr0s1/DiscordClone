const { User } = require("../../mongodb/schemas")

async function addUser(parent, args, context) {
    const User = context.mongo.User

    // Check if user already exists
    let userFound = await User.find({
        username: args.username
    })

    if (userFound.length == 0) { // User doesn't exist
        let newUser = await User.create({
            username: args.username,
            phone_number: args.phone_number,
            email: args.email,
            name: args.name,
        })

        return newUser
    } else {
        throw new Error(`User already exists!`)
    }
}

async function createGroup(parent, args, context) {
    let admin = args.username
    let Group = context.mongo.Group

    // Fetch information of user who created this group
    let userFound = await User.find({
        username: admin
    })

    if (userFound.length == 0) {
        throw new Error(`User does not exist!`)
    } else {
        // Get user id because MongoDB save objectID
        let adminId = userFound[0]._id

        // Check if the group already exists
        let groupFound = await Group.find({
            groupName: args.groupName,
            admin: adminId
        })

        if (groupFound.length == 0) {
            let newGroup = {
                groupName: args.groupName,
                admin: adminId,
                members: [adminId]
            }

            try {
                let result = await Group.create(newGroup)

                await Group.populate(result, { path: 'admin members' })

                // Add this newly created group to user's list of groups
                await User.findOneAndUpdate({
                    username: admin
                }, {
                    $push: {groups: result._id}
                })

                return result
            } catch (e) {
                throw new Error(e)
            }
        } else {
            throw new Error('Group is already created')
        }
    }
}

async function addUserToGroup(parent, args, context) {
    let username = args.username

    let User = context.mongo.User
    let Group = context.mongo.Group

    let userFound = await User.findOne({
        username
    })

    if (!userFound) {
        throw new Error('User does not exist!')
    } else {
        let userId = userFound._id

        let groupAdmin = await User.findOne({
            username: args.admin
        })

        let groupFound = await Group.findOne({
            groupName: args.groupName,
            admin: groupAdmin._id
        })

        if (groupAdmin && groupFound) {
            if (groupFound.members.includes(userId)) {
                throw new Error('User is already in group')
            } else {
                await Group.findOneAndUpdate({
                    groupName: args.groupName,
                    admin: groupAdmin._id
                }, {
                    $push: { members: userId }
                })

                // Add this newly created group to user's list of groups
                await User.findOneAndUpdate({
                    username
                }, {
                    $push: {groups: groupFound._id}
                })

                let result = await Group.findOne({
                    groupName: args.groupName,
                    admin: groupAdmin._id
                }).populate('admin members').select({ "_id": 0 })

                return result
            }
        } else {
            throw new Error('Group does not exist')
        }
    }
}

async function removeUserFromGroup(parent, args, context) {
    let username = args.username

    let User = context.mongo.User
    let Group = context.mongo.Group

    let userFound = await User.findOne({
        username
    })

    if (!userFound) {
        throw new Error('User does not exist!')
    } else {
        let userId = userFound._id

        let groupAdmin = await User.findOne({
            username: args.admin
        })

        let groupFound = await Group.findOne({
            groupName: args.groupName,
            admin: groupAdmin._id
        })

        if (groupAdmin && groupFound) {
            if (groupFound.members.includes(userId)) {
                let result = await Group.findOne({
                    groupName: args.groupName,
                    admin: groupAdmin._id
                })

                result.members.splice(result.members.indexOf(userId), 1)

                await Group.updateOne({
                    groupName: args.groupName,
                    admin: groupAdmin._id
                }, {
                    members: result.members
                })

                await Group.populate(result, { path: 'admin members' })

                userFound.groups.splice(userFound.groups.indexOf(groupFound._id), 1)

                await User.findOneAndUpdate({
                    _id: userId
                }, {
                    groups: userFound.groups
                })

                return result
            } else {
                throw new Error('User is already in group')
            }
        } else {
            throw new Error('Group does not exist')
        }
    }
}

module.exports = {
    addUser,
    createGroup,
    addUserToGroup,
    removeUserFromGroup
}