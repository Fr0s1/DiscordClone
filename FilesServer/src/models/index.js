const mongoose = require('mongoose')

const userSchema = require('./User')

const User = mongoose.model('User', userSchema)

let ENV = process.env.ENV
let connectionUri
let database = process.env.mongdb_database
let mongodb_host = process.env.mongodb_host
if (ENV == "AWS") {
    let mongodb_user = process.env.mongodb_user
    let mongodb_password = process.env.mongdb_password

    connectionUri = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/${database}?retryWrites=true&w=majority`
} else {
    let mongodb_port = process.env.mongodb_port
    console.log(mongodb_port)
    connectionUri = `mongodb://${mongodb_host}:${mongodb_port}/${database}`
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