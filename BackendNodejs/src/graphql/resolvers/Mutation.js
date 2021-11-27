const { User } = require("../../mongodb/schemas")
const { RedisPubSub } = require('graphql-redis-subscriptions')
const Redis = require('ioredis');

const options = {
    host: process.env.redisHost,
    port: process.env.redisPort,
    retryStrategy: times => {
        // reconnect after
        return Math.min(times * 50, 2000);
    }
};

const pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options)
});

// Add AWS Cognito user information to MongoDB to make it easier to write resolvers 
// Just need to query to MongoDB instead of fetching using Cognito SDK
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
            birthdate: args.birthdate,
            accountStatus: "Online", // This mutation only called once from frontend when user first sign up, so account status is online
            lastOnlineTime: new Date().toISOString()
        })

        return newUser
    } else {
        throw new Error(`User already exists!`)
    }
}

// Create group chat
async function createGroup(parent, args, context) {
    let admin = context.tokenPayload.username
    let Group = context.mongo.Group

    try {

    } catch (e) {
        throw new Error(e)
    }

    // Fetch information of user who created this group
    let userFound = await User.findOne({
        username: admin
    })

    if (userFound.length == 0) {
        throw new Error(`User does not exist!`)
    } else {
        // Get admin id because MongoDB save ObjectID
        let adminId = userFound._id

        // Check if the group was already created by this user
        let groupFound = await Group.find({
            groupName: args.groupName,
            admin: adminId
        })

        if (groupFound.length == 0) { // No group found
            let newGroup = {
                groupName: args.groupName,
                admin: adminId,
                members: [adminId]
            }

            try {
                let result = await Group.create(newGroup)

                // Add this newly created group to admin's list of groups
                await User.findOneAndUpdate({
                    username: admin
                }, {
                    $push: { groups: result._id }
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

        let groupFound = await Group.findOne({
            _id: args.groupId
        })

        if (groupFound) {
            if (groupFound.members.includes(userId)) {
                throw new Error('User is already in group')
            } else {
                let result = await Group.findOneAndUpdate({
                    _id: groupFound._id
                }, {
                    $push: { members: userId }
                }, {
                    new: true
                })

                if (!userFound.groups.includes(groupFound._id)) {
                    // Include this group to user list of group the user is in
                    await User.findOneAndUpdate({
                        username
                    }, {
                        $push: { groups: groupFound._id }
                    }, {
                        returnDocument: 'after'
                    })
                }

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

        let groupFound = await Group.findOne({
            _id: args.groupId
        })

        // Check if group exists
        if (groupFound) {
            if (groupFound.members.includes(userId)) {

                groupFound.members.splice(groupFound.members.indexOf(userId), 1)

                await Group.updateOne({
                    _id: groupFound._id
                }, {
                    members: groupFound.members
                })

                pubsub.publish("MEMBER_LEAVES_GROUP", { type: "leave", user: userFound })

                return groupFound
            } else {
                throw new Error('User is not in group')
            }
        } else {
            throw new Error('Group does not exist')
        }
    }
}

async function changeMessageInfo(parent, args, context) {
    let Message = context.mongo.Message

    let messageId = args.messageId

    let newMessageInfo = { ...args }
    delete newMessageInfo.messageId

    try {
        let result = await Message.findByIdAndUpdate({
            _id: messageId
        }, newMessageInfo, {
            returnDocument: "after"
        })

        return result

    } catch (e) {
        throw new Error("Can't update message info at the moment" + e)
    }
}

async function deleteMessage(parent, args, context) {
    let messageId = args.messageId
    let Message = context.mongo.Message

    let foundMessage = await Message.findOne({
        _id: messageId
    }).populate('sender').populate('receiver')

    if (!foundMessage) {
        throw new Error('Message does not exist')
    }

    if (context.tokenPayload.username == foundMessage.sender.username) {
        foundMessage.markedDeletedBySender = true;
    } else {
        foundMessage.markedDeletedByReceiver = true;
    }

    if (foundMessage.markedDeletedBySender && foundMessage.markedDeletedByReceiver) {
        let Bucket = process.env.BUCKET_NAME
        let Key = `message/${foundMessage._id}/`
        let deletedMessage = await Message.findByIdAndDelete({
            _id: foundMessage._id
        })

        await context.aws.emptyS3Directory(Bucket, Key)

        return deletedMessage
    } else {
        await Message.findOneAndUpdate({
            _id: messageId
        }, foundMessage)
    }

    return foundMessage
}

async function deleteGroupMessage(parent, args, context) {
    let username = context.tokenPayload.username
    let messageId = args.messageId
    let GroupMessage = context.mongo.GroupMessage

    try {
        let foundMessage = await GroupMessage.findOne({
            _id: messageId
        }).populate('sender')

        if (!foundMessage) {
            throw new Error(`Message with id ${messageId} does not exists`)
        }

        if (username === foundMessage.sender.username) {
            if (foundMessage.files.length > 0) {
                let Bucket = process.env.BUCKET_NAME
                let Key = `groupmessage/${foundMessage._id}/`
                context.aws.emptyS3Directory(Bucket, Key)
            }

            let deletedMessage = await GroupMessage.findByIdAndDelete({
                _id: foundMessage._id
            })

            pubsub.publish("GROUP_MESSAGE_DELETED", deletedMessage)

            return deletedMessage
        } else {
            throw new Error("Message not sent by this user")
        }

    } catch (e) {
        throw new Error(e)
    }
}

async function updateUserInfo(parent, args, context) {
    let username = context.tokenPayload.username
    let phone_number = args.phone_number
    let name = args.name
    let email = args.email
    let birthdate = args.birthdate

    let User = context.mongo.User

    let accountStatus = args.accountStatus
    let lastOnlineTime = args.lastOnlineTime

    let UserAttributes = []
    let updatedInfo = {}
    if (phone_number) {
        UserAttributes.push({
            Name: "phone_number",
            Value: phone_number
        })

        updatedInfo.phone_number = phone_number
    }
    if (name) {
        UserAttributes.push({
            Name: "name",
            Value: name
        })

        updatedInfo.name = name
    }
    if (email) {
        UserAttributes.push({
            Name: "email",
            Value: email
        })

        updatedInfo.email = email
    }
    if (birthdate) {
        UserAttributes.push({
            Name: "birthdate",
            Value: birthdate
        })

        updatedInfo.birthdate = birthdate
    }

    if (accountStatus) {
        updatedInfo.accountStatus = accountStatus
    }

    if (lastOnlineTime) {
        updatedInfo.lastOnlineTime = lastOnlineTime
    }

    let cognitoClient = context.aws.cognitoClient

    var params = {
        UserAttributes,
        UserPoolId: process.env.cognitoUserPoolId, /* required */
        Username: username, /* required */
    };

    try {
        let updatedUser = await User.findOneAndUpdate({
            username
        }, updatedInfo, {
            returnDocument: "after"
        })

        if (updatedInfo.accountStatus) {
            let publishInfo = {
                username,
                accountStatus: updatedInfo.accountStatus,
            }

            pubsub.publish("ACCOUNT_STATUS_CHANGED", { ...publishInfo, lastOnlineTime: updatedInfo.lastOnlineTime })

            pubsub.publish("GROUP_MEMBERS_ACCOUNT_STATUS_CHANGED", publishInfo)
        }

        if (UserAttributes.length > 0) {
            let data = await cognitoClient.adminUpdateUserAttributes(params).promise()
        }

        return updatedUser
    } catch (e) {
        throw new Error(e)
    }
}

async function addUserToContactList(parent, args, context) {
    let username = args.username
    let currentUser = context.tokenPayload.username
    let User = context.mongo.User

    try {
        let addedUser = await User.findOne({
            username
        })

        if (addedUser) {
            let result = await User.findOneAndUpdate({
                username: currentUser,
                contactlist: { $nin: [addedUser._id] } // Check if added user is already in logged in user's contact list
            }, {
                $push: { contactlist: addedUser._id }
            }, {
                returnDocument: "after"
            })

            if (result === null) {
                throw new Error(`User ${username} is already contactlist`)
            }
            return result
        } else {
            throw new Error(`User with username ${username} does not exist`)
        }
    } catch (e) {
        throw new Error(e)
    }
}

async function removeUserFromContactList(parent, args, context) {
    let username = args.username

    let User = context.mongo.User

    try {
        let userFound = await User.findOne({
            username
        })

        if (!userFound) {
            throw new Error(`User ${username} does not exist`)
        } else {
            let currentUser = context.tokenPayload.username

            let result = await User.findOneAndUpdate({
                username: currentUser
            }, {
                $pull: { contactlist: userFound._id }
            }, {
                returnDocument: "after"
            })

            return result
        }
    } catch (e) {
        console.log(e)
        throw new Error("Can't do that operation at the moment")
    }
}

module.exports = {
    addUser,
    createGroup,
    addUserToGroup,
    removeUserFromGroup,
    deleteMessage,
    deleteGroupMessage,
    updateUserInfo,
    addUserToContactList,
    removeUserFromContactList,
    changeMessageInfo
}