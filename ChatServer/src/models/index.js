const mongoose = require('mongoose')

const userSchema = require('./User')
const groupSchema = require('./Group')
const messageSchema = require('./Message')
const groupMessageSchema = require('./GroupMessage')

const User = mongoose.model('User', userSchema)
const Group = mongoose.model('Group', groupSchema)
const Message = mongoose.model('Message', messageSchema)
const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema)

let ENV = process.env.ENV
let connectionUri
let mongodb_host = process.env.mongodb_host
let mongodb_database = process.env.mongodb_database

if (ENV == "AWS") {
    /* If deployed on AWS, key/value pair is mounted as
    file in previously specified directory
    */

    // Get name of secret file
    let secretName = process.env.AWS_SecretName

    // Get path of directory which stores the file
    let secretsStorePath = process.env.SECRETS_STORE_PATH

    let secretsJsonString = fs.readFileSync(path.join(secretsStorePath, secretName), {
        encoding: "utf-8"
    })

    let secrets = JSON.parse(secretsJsonString)

    let mongodb_user = secrets.mongodb_user
    let mongodb_password = secrets.mongdb_password

    connectionUri = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${mongodb_database}?retryWrites=true&w=majority`
} else {
    let mongodb_port = process.env.mongodb_port
    connectionUri = `mongodb://${mongodb_host}:${mongodb_port}/${mongodb_database}`
}
main().catch(err => console.log(err));

async function main() {
    console.log(connectionUri)

    await mongoose.connect(connectionUri);

    console.log('Connected to MongoDB')
}

const mongo = {
    mongoose,
    User,
    Group,
    Message,
    GroupMessage
}

module.exports = mongo