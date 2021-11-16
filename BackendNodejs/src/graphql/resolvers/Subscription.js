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

function accountStatusSubscribe() {
    return pubsub.asyncIterator(["ACCOUNT_STATUS_CHANGED"])
}

const mongoUtilFunctions = require('../../mongodb/utils/utils')

const accountStatusInfo = {
    subscribe: withFilter(accountStatusSubscribe,
        async (payload, variables) => {
            console.log(payload)
            console.log(variables)
            return await mongoUtilFunctions.ifInContactList(payload.username, variables.username)
        }
    ),
    resolve: payload => {
        return payload
    }
}

module.exports = {
    accountStatusInfo
}