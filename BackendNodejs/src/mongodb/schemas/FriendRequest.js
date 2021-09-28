const mongoose = require('mongoose')
const { Schema } = mongoose;

const friendRequestSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    acceptStatus: [{
        type: Schema.Types.Boolean,
        default: false
    }],
    sentTime: {
        type: Date,
        default: mongoose.now()
    }
}, { versionKey: false })

module.exports = friendRequestSchema