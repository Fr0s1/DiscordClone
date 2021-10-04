const mongoose = require('mongoose')
const { Schema } = mongoose;

const groupMessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: Schema.Types.String
    },
    files: {
        type: [{
            fileType: Schema.Types.String,
            fileName: Schema.Types.String
        }]
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    },
    sentTime: {
        type: Schema.Types.Date,
        default: Date.now
    }
}, { versionKey: false })

module.exports = groupMessageSchema