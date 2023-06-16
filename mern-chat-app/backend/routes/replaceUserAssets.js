var express = require('express');
var router = express.Router();
const AssetModel = require('../models/asset-model');
const UserAssetModel = require('../models/userAsset-model');

router.put('/', async (req, res) => {
    try {
        const { username,laptop, keyboard, mouse, headphone, dongle, 
            oldLaptop, oldKeyboard, oldMouse, oldHeadphone, oldDongle } = req.body;
        
        let value = laptop || keyboard || mouse || headphone || dongle
        if (value) {
            if(keyboard && oldKeyboard){
                const replaceAssets = await UserAssetModel.findOneAndUpdate(
                    {username},
                    { $set: { "keyboard" : keyboard  } },
                    { multi: false, new: true }
                );
                const id = await AssetModel.findOne({ keyboard: { $exists: true } })
                const updatedAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "keyboard.model" : keyboard },
                    { $set: { "keyboard.$.assigned": true } },
                    { multi: false, new: true }
                );
                const updatedOldAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "keyboard.model" : oldKeyboard },
                    { $set: { "keyboard.$.assigned": false } },
                    { multi: false, new: true }
                );
            }
            if(mouse && oldMouse){
                const replaceAssets = await UserAssetModel.findOneAndUpdate(
                    {username},
                    { $set: { "mouse" : mouse  } },
                    { multi: false, new: true }
                );
                const id = await AssetModel.findOne({ mouse: { $exists: true } })
                const updatedAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "mouse.model" : mouse },
                    { $set: { "mouse.$.assigned": true } },
                    { multi: false, new: true }
                );
                const updatedOldAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "mouse.model" : oldMouse },
                    { $set: { "mouse.$.assigned": false } },
                    { multi: false, new: true }
                );
            }
            if(headphone && oldHeadphone){
                const replaceAssets = await UserAssetModel.findOneAndUpdate(
                    {username},
                    { $set: { "headphone" : headphone  } },
                    { multi: false, new: true }
                );
                const id = await AssetModel.findOne({ headphone: { $exists: true } })
                const updatedAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "headphone.model" : headphone },
                    { $set: { "headphone.$.assigned": true } },
                    { multi: false, new: true }
                );
                const updatedOldAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "headphone.model" : oldHeadphone },
                    { $set: { "headphone.$.assigned": false } },
                    { multi: false, new: true }
                );
            }
            if(dongle && oldDongle){
                const replaceAssets = await UserAssetModel.findOneAndUpdate(
                    {username},
                    { $set: { "dongle" : dongle  } },
                    { multi: false, new: true }
                );
                const id = await AssetModel.findOne({ dongle: { $exists: true } })
                const updatedAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "dongle.model" : dongle },
                    { $set: { "dongle.$.assigned": true } },
                    { multi: false, new: true }
                );
                const updatedOldAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "dongle.model" : oldDongle },
                    { $set: { "dongle.$.assigned": false } },
                    { multi: false, new: true }
                );
            }
            if(laptop && oldLaptop){
                const replaceAssets = await UserAssetModel.findOneAndUpdate(
                    {username},
                    { $set: { "laptop" : laptop  } },
                    { multi: false, new: true }
                );
                const id = await AssetModel.findOne({ laptop: { $exists: true } })
                const updatedAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "laptop.model" : laptop },
                    { $set: { "laptop.$.assigned": true } },
                    { multi: false, new: true }
                );
                const updatedOldAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "laptop.model" : oldLaptop },
                    { $set: { "laptop.$.assigned": false } },
                    { multi: false, new: true }
                );
            }
            return res.status(200).send('updated success')
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }
})


module.exports = router;