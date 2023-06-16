const mongoose = require('mongoose');

const UserAssetModel = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    laptop: {type: String},
    keyboard: {type: String},
    mouse: {type: String},
    headphone: {type: String},
    dongle: {type: String}
},{ timestamps: true });

module.exports = mongoose.model('UserAssetModel', UserAssetModel);