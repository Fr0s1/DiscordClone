const mongoose = require('mongoose')
const { Schema } = mongoose;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    },
    filesUrl: [{
        type: String
    }],
    sentTime: {
        type: Schema.Types.Date
    }
}, { versionKey: false })

module.exports = messageSchema