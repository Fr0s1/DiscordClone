const mongoose = require('mongoose')

const userSchema = require('./User')
const groupSchema = require('./Group')
const messageSchema = require('./Message')

const User = mongoose.model('User', userSchema)
const Group = mongoose.model('Group', groupSchema)
const Message = mongoose.model('Message', messageSchema)

// let user = 'm001-student'
// let password = 'm001-mongodb-basics'
let database = 'discord'
let host = 'localhost:27017'
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
    Message
}

module.exports = mongo