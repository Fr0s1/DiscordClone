const mongoose = require('mongoose')

const userSchema = require('./User')

const User = mongoose.model('User', userSchema)

let ENV = process.env.ENV
let connectionUri
let mongodb_host = process.env.mongodb_host
let mongodb_database = process.env.mongodb_database

if (ENV == "AWS") {
    /*  
        If deployed on AWS, key/value pair is mounted as
        file in previously specified directory
    */

    const fs = require('fs');
    const path = require('path');

    // Get name of secret file
    let secretName = process.env.AWS_SecretName

    // Get path of directory which stores the file
    let secretsStorePath = process.env.SECRETS_STORE_PATH

    let secretsJsonString = fs.readFileSync(path.join(secretsStorePath, secretName), {
        encoding: "utf-8"
    })

    let secrets = JSON.parse(secretsJsonString)

    let mongodb_user = secrets.mongodb_user
    let mongodb_password = secrets.mongodb_password

    connectionUri = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}?retryWrites=true&w=majority`
} else {
    let mongodb_port = process.env.mongodb_port
    connectionUri = `mongodb://${mongodb_host}:${mongodb_port}/${mongodb_database}`
}

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(connectionUri);

    console.log('Connected to MongoDB')
}

const mongo = {
    mongoose,
    User,
}

module.exports = mongo