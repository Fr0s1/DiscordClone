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