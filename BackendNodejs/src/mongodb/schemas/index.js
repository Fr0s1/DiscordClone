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
    // const result = await User.findOne({
    //     username: 'hieudt223'
    // }).populate('friendlist').populate('contactlist')

    // console.log(result)
    // const group = await Group.findOne({
    //     groupName: 'tes',
    //     admin: result._id
    // })
    // console.log(group)
    // let adminFound = await User.findOne({
    //     username: "hieudt223"
    // })

    // let result = await Group.findOne({
    //     // admin: adminFound._id,
    //     groupName: "tes"
    // }).populate('groupMembers')

    // console.log(result)
    // Group.findOne({
    //     // admin: adminFound._id,
    //     groupName: "tes"
    // }).populate('groupAdmin').exec((error, groupAdmin) => {
    //     console.log(groupAdmin)
    // })

    // let username = mongoose.Types.ObjectId('6151ad49dc7dc28f1ba1e0df')

    // let messages = await GroupMessage.findOne({
    //     _id: "6162562c56c700971810b04c"
    // }).sort({sentTime: 'desc'})
    // console.log(messages)

    // const axios = require('axios')

    // let result = await axios.get('http://localhost:8080/file/users/avatar/hieudt223')

    // console.log(result)
}

const mongo = {
    mongoose,
    User,
    Group,
    Message,
    GroupMessage
}

module.exports = mongo