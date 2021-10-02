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

groupSchema.virtual('groupMembers', {
    ref: 'User',
    localField: 'members',
    foreignField: '_id',
})

groupSchema.virtual('groupAdmin', {
    ref: 'User',
    localField: 'admin',
    foreignField: '_id',
    justOne: true
})

groupSchema.set('toObject', { virtuals: true });
groupSchema.set('toJSON', { virtuals: true });
module.exports = groupSchema