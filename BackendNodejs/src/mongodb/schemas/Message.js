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
        type: Schema.Types.String
    },
    files: {
        type: [{
            fileType: Schema.Types.String,
            fileName: Schema.Types.String
        }]
    },
    markedDeletedBySender: {
        type: Schema.Types.Boolean,
        default: false
    },
    markedDeletedByReceiver: {
        type: Schema.Types.Boolean,
        default: false
    },
    sentTime: {
        type: Schema.Types.Date,
        default: Date.now()
    }
}, { versionKey: false })

module.exports = messageSchema