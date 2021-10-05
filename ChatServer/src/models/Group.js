const mongoose = require('mongoose')
const { Schema } = mongoose;

const groupSchema = new Schema({
    groupName: {
        type: String,
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: mongoose.now()
    },
    groupAvatar: {
        type: String
    }
}, { versionKey: false })

module.exports = groupSchema