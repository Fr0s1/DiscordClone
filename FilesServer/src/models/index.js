const mongoose = require('mongoose')

const userSchema = require('./User')

const User = mongoose.model('User', userSchema)

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
}

module.exports = mongo