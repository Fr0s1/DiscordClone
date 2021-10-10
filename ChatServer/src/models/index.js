const mongoose = require('mongoose')

const userSchema = require('./User')
const groupSchema = require('./Group')
const messageSchema = require('./Message')
const groupMessageSchema = require('./GroupMessage')

const User = mongoose.model('User', userSchema)
const Group = mongoose.model('Group', groupSchema)
const Message = mongoose.model('Message', messageSchema)
const GroupMessage = mongoose.model('GroupMessage', groupMessageSchema)

// let user = 'm001-student'
// let password = 'm001-mongodb-basics'
let database = process.env.database
let host = process.env.host
let connectionUri = `mongodb://${host}/${database}`


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