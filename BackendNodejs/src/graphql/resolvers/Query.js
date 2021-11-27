async function user(parent, args, context) {
    const User = context.mongo.User

    let user = await User.findOne({
        username: args.username
    })

    return user
}

async function group(parent, args, context) {
    const Group = context.mongo.Group

    try {
        let result = await Group.findOne({
            _id: args.groupId
        })

        return result
    } catch (e) {
        throw new Error(`Can't find group at given moment. Try again later`)
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
    ).sort({ sentTime: 'desc' }).limit(limit + 1)
    // Get one more message so that if there aren't any message left
    // Next cursor is empty
    
    let sentMessages = messages.slice(0, limit)

    let result = {
        messages: sentMessages,
        count: sentMessages.length,
        get nextCursor() {
            return messages[limit] ? messages[limit].sentTime : ""
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
    }).sort({ sentTime: 'desc' }).limit(limit + 1)
    // Get one more message so that if there aren't any message left
    // Next cursor is empty

    let sentGroupMessages = messages.slice(0, limit)

    let result = {
        messages: sentGroupMessages,
        count: sentGroupMessages.length,
        get nextCursor() {
            return messages[limit] ? messages[limit].sentTime : ""
        }
    }
    return result
}

module.exports = {
    user,
    group,
    groupsList,
    userMessages,
    groupMessages
}