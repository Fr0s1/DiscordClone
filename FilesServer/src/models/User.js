const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: Schema.Types.String,
        unique: true
    },
    email: {
        type: Schema.Types.String,
        unique: true
    },
    phone_number: {
        type: Schema.Types.String,
        unique: true
    },
    name: {
        type: Schema.Types.String,
        unique: true,
    },
    birthdate: {
        type: Schema.Types.String
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
    accountStatus: {
        type: Schema.Types.String
    },
    lastOnlineTime: {
        type: Schema.Types.Date
    },
    avatar: {
        type: Schema.Types.String
    }
}, { versionKey: false })

module.exports = userSchema