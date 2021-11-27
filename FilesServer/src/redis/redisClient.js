const redis = require('redis')
const { promisifyAll } = require('bluebird');
// Create Redis Client

promisifyAll(redis);

let ENV = process.env.ENV

let redisOption = {}

if (ENV !== "DEV") {
    redisOption.host = process.env.redisHost
}

const client = redis.createClient(redisOption);

const runApplication = async () => {
    // Connect to redis at 127.0.0.1 port 6379 no password.
    console.log('Connected to Redis...')
};

runApplication();

module.exports = client
