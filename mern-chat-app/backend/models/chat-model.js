const mongoose = require('mongoose');

const ChatModel = mongoose.Schema({
    chatName:{
        type: String,
        trim: true
    },
    isGroupChat:{
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SignupModel'
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'MessageModel'
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SignupModel'
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('ChatModel', ChatModel);