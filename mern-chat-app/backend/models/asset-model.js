const mongoose = require('mongoose');

const AssetModel = mongoose.Schema({
    laptop: [
        {
           model: {
            type: String,
            unique: true,
            required: true
           },
           assigned:{
            type: Boolean,
            default:false,
            required: true
           }
        }
    ],
    keyboard: [
        {
            model: {
             type: String,
             unique: true,
             required: true
            },
            assigned:{
             type: Boolean,
             default:false,
             required: true
            }
         }
    ],
    mouse: [
        {
            model: {
             type: String,
             unique: true,
             required: true
            },
            assigned:{
             type: Boolean,
             default:false,
             required: true
            }
         }
    ],
    headphone: [
        {
            model: {
             type: String,
             unique: true,
             required: true
            },
            assigned:{
             type: Boolean,
             default:false,
             required: true
            }
         }
    ],
    dongle: [
        {
            model: {
             type: String,
             unique: true,
             required: true
            },
            assigned:{
             type: Boolean,
             default:false,
             required: true
            }
         }
    ],
    
}, { timestamps: true });

module.exports = mongoose.model('AssetModel', AssetModel);