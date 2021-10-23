async function user(parent, args, context) {
    const User = context.mongo.User

    let user = await User.findOne({
        username: args.username
    })

    return user
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
        })

        return result
    } else {
        throw new Error('Admin for this group does not exists')
    }
}

async function groupsList(parent, args, context) {
    const Group = context.mongo.Group

    let result = await Group.find({
        groupName: args.groupName
    })

    return result
}

async function userMessages(parent, args, context) {
    const Message = context.mongo.Message
    const User = context.mongo.User

    const nextCursor = args.nextCursor
    const limit = args.limit

    let firstUser = await User.findOne({
        username: args.firstUser
    })

    let secondUser = await User.findOne({
        username: args.secondUser
    })

    let messages = await Message.find(
        {
            $and: [{ sentTime: { $lt: nextCursor } }, {
                $or: [
                    {
                        $and: [
                            { sender: firstUser._id },
                            { receiver: secondUser._id },
                            { markedDeletedBySender: false }
                        ]
                    },
                    {
                        $and: [
                            { receiver: firstUser._id },
                            { sender: secondUser._id },
                            { markedDeletedByReceiver: false }
                        ]
                    }
                ]
            }]
        }
    ).sort({ sentTime: 'desc' }).limit(limit)

    let result = {
        messages,
        count: messages.length,
        get nextCursor() {
            return this.count > 0 ? messages[messages.length - 1].sentTime : ""
        }
    }
    return result
}

async function groupMessages(parent, args, context) {
    const GroupMessage = context.mongo.GroupMessage
    const nextCursor = args.nextCursor
    const limit = args.limit

    let messages = await GroupMessage.find({
        $and: [{
            group: args.groupId
        },
        {
            sentTime: { $lt: nextCursor }
        }
        ]
    }).sort({ sentTime: 'desc' }).limit(limit)

    let result = {
        messages,
        count: messages.length,
        get nextCursor() {
            return this.count > 0 ? messages[messages.length - 1].sentTime : ""
        }
    }
    return result
}

function test(parent, args, context) {
    return "hello"
}

module.exports = {
    user,
    group,
    groupsList,
    userMessages,
    groupMessages,
    test
}