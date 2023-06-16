var express = require('express');
var router = express.Router();
const AssetModel = require('../models/asset-model');
const UserAssetModel = require('../models/userAsset-model');

router.put('/', async (req, res) => {
    try {
        const { username,laptop, keyboard, mouse, headphone, dongle } = req.body;
        
        let value = laptop || keyboard || mouse || headphone || dongle
        if (value) {
            if(keyboard){
                const removeAsset = await UserAssetModel.findOneAndUpdate(
                    {username},
                    { $unset: { "keyboard" : keyboard  } },
                    { multi: false, new: true }
                );
                const id = await AssetModel.findOne({ keyboard: { $exists: true } })
                const updatedAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "keyboard.model" : keyboard },
                    { $set: { "keyboard.$.assigned": false } },
                    { multi: false, new: true }
                );
            }
            if(mouse){
                const removeAsset = await UserAssetModel.findOneAndUpdate(
                    {username},
                    { $unset: { "mouse" : mouse  } },
                    { multi: false, new: true }
                );
                const id = await AssetModel.findOne({ mouse: { $exists: true } })
                const updatedAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "mouse.model" : mouse },
                    { $set: { "mouse.$.assigned": false } },
                    { multi: false, new: true }
                );
            }
            if(headphone){
                const removeAsset = await UserAssetModel.findOneAndUpdate(
                    {username},
                    { $unset: { "headphone" : headphone  } },
                    { multi: false, new: true }
                );
                const id = await AssetModel.findOne({ headphone: { $exists: true } })
                const updatedAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "headphone.model" : headphone },
                    { $set: { "headphone.$.assigned": false } },
                    { multi: false, new: true }
                );
            }
            if(dongle){
                const removeAsset = await UserAssetModel.findOneAndUpdate(
                    {username},
                    { $unset: { "dongle" : dongle  } },
                    { multi: false, new: true }
                );
                const id = await AssetModel.findOne({ dongle: { $exists: true } })
                const updatedAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "dongle.model" : dongle },
                    { $set: { "dongle.$.assigned": false } },
                    { multi: false, new: true }
                );
            }
            if(laptop){
                const removeAsset = await UserAssetModel.findOneAndUpdate(
                    {username},
                    { $unset: { "laptop" : laptop  } },
                    { multi: false, new: true }
                );
                const id = await AssetModel.findOne({ laptop: { $exists: true } })
                const updatedAsset = await AssetModel.findOneAndUpdate(
                    { _id: id._id, "laptop.model" : laptop },
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