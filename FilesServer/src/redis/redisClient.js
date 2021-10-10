const redis = require('redis')
const { promisifyAll } = require('bluebird');
// Create Redis Client

promisifyAll(redis);

const client = redis.createClient();

const runApplication = async () => {
    // Connect to redis at 127.0.0.1 port 6379 no password.
    console.log('Connected to Redis...')
};

runApplication();


module.exports = client