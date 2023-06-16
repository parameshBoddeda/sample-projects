const mongoose = require('mongoose');

const MessageModel = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SignupModel'
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat'
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('MessageModel', MessageModel);