const mongoose = require('mongoose')

const userSchema = require('./User')
const groupSchema = require('./Group')
const messageSchema = require('./Message')
const groupMessageSchema = require('./GroupMessage')

const User = mongoose.model('User', userSchema)
const Group = mongoose.model('Group', groupSchema)
const Message = mongoose.model('Message', messageSchema)
const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema)


// let mongodb_user = process.env.mongodb_user
// let mongodb_password = process.env.mongdb_password
let database = process.env.database
let host = process.env.host
let connectionUri = `mongodb://${host}/${database}`
// const uri = `mongodb+srv://${mongodb_user}:${mongodb_password}@sandbox.8g94t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
main().catch(err => console.log(err));

async function main() {
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