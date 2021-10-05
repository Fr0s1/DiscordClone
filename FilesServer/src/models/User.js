const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    phone_number: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        unique: true,
    },
    friendlist: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    contactlist: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }],
    avatar: {
        type: Schema.Types.String
    }
}, { versionKey: false })

module.exports = userSchema