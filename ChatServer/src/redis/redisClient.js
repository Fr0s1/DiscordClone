const redis = require('redis')
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

let ENV = process.env.ENV

let redisOption = {}
if (ENV !== "DEV") {
    redisOption.host = process.env.redisHost
}

const client = redis.createClient(redisOption);

const runApplication = async () => {
    console.log('Connected to Redis...')
};

runApplication();


module.exports = client