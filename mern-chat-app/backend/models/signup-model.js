const mongoose = require('mongoose');

const SignupModel = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pic: {
        type: "String",
        required: true,
        default:
            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
      rolename:{
        type: String,
        required: true,
        default: 'user'
      },
      enabled:{
        type: Boolean,
        required:true,
        default: false
      }
}, { timestamps: true });

module.exports = mongoose.model('SignupModel', SignupModel);