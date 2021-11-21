const { RedisPubSub } = require('graphql-redis-subscriptions')
const Redis = require('ioredis');
const { withFilter } = require('graphql-subscriptions');

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

function subscriptionEvents() {
    return pubsub.asyncIterator(["ACCOUNT_STATUS_CHANGED", "GROUP_MEMBERS_ACCOUNT_STATUS_CHANGED", "GROUP_MESSAGE_DELETED"])
}

const mongoUtilFunctions = require('../../mongodb/utils/utils')

const accountStatusInfo = {
    subscribe: withFilter(subscriptionEvents,
        async (payload, variables) => {
            return await mongoUtilFunctions.ifInContactList(payload.username, variables.loggedInUsername)
        }
    ),
    resolve: payload => {
        return payload
    }
}

const groupMembersAccountStatus = {
    subscribe: withFilter(subscriptionEvents, async (payload, variables) => {
        return await mongoUtilFunctions.ifUserInGroupWithId(variables.groupId, payload.username)
    }),
    resolve: payload => {
        return payload
    }
}

const groupMessageDeleted = {
    subscribe: withFilter(subscriptionEvents, (payload, variables) => {
        return payload.group === variables.groupId
    }),
    resolve: payload => {
        return payload
    }
}

module.exports = {
    accountStatusInfo,
    groupMembersAccountStatus,
    groupMessageDeleted
}