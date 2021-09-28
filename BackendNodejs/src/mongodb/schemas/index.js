const mongoose = require('mongoose')

const userSchema = require('./User')
const groupSchema = require('./Group')
const User = mongoose.model('User', userSchema)
const Group = mongoose.model('Group', groupSchema)

let user = 'm001-student'
let password = 'm001-mongodb-basics'
let database = 'discord'
let host = 'localhost:27017'
let connectionUri = `mongodb://${host}/${database}`

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(connectionUri);

    console.log('Connected to MongoDB')
    // const result = await User.findOne({
    //     username: 'hieudt223'
    // }).populate('friendlist').populate('contactlist')

    // console.log(result)
    // const group = await Group.findOne({
    //     groupName: 'tes',
    //     admin: result._id
    // })
    // console.log(group)
    let adminFound = await User.findOne({
        username: "hieudt223"
    })

    let result = await Group.findOne({
        admin: adminFound._id,
        groupName: "tes"
    }).populate('admin').populate('members')

    // console.log(result)
}

const mongo = {
    mongoose,
    User,
    Group
}

module.exports = mongo