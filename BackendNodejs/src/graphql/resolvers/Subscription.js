const { RedisPubSub } = require('graphql-redis-subscriptions')
const pubsub = new RedisPubSub();

function accountStatusSubscribe() {
    return pubsub.asyncIterator(["ACCOUNT_STATUS_CHANGED"])
}

const accountStatusInfo = {
    subscribe: accountStatusSubscribe,
    resolve: payload => {
        return payload
    }
}

module.exports = {
    accountStatusInfo
}