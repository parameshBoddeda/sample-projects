var express = require('express');
var router = express.Router();
const AssetModel = require('../models/asset-model');

router.put('/', async (req,res)=>{
    try{
        const { oldLaptop, oldKeyboard, oldMouse, oldHeadphone, oldDongle } = req.body;

        if ( oldLaptop) {
            const id = await AssetModel.findOne({ laptop: { $exists: true } });
            
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { _id: id._id, "laptop.model": oldLaptop },
                { $pull: { laptop: { model: oldLaptop } } },
                { new: true, multi: false }
            );
        }
        if ( oldKeyboard) {
            const id = await AssetModel.findOne({ keyboard: { $exists: true } });
            
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { _id: id._id, "keyboard.model": oldKeyboard },
                { $pull: { keyboard: { model: oldKeyboard } } },
                { new: true, multi: false }
            );
        }
        if ( oldMouse) {
            const id = await AssetModel.findOne({ mouse: { $exists: true } });
            
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { _id: id._id, "mouse.model": oldMouse },
                { $pull: { mouse: { model: oldMouse } } },
                { new: true, multi: false }
            );
        }
        if ( oldHeadphone) {
            const id = await AssetModel.findOne({ headphone: { $exists: true } });
            
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { _id: id._id, "headphone.model": oldHeadphone },
                { $pull: { headphone: { model: oldHeadphone } } },
                { new: true, multi: false }
            );
        }
        if ( oldDongle) {
            const id = await AssetModel.findOne({ dongle: { $exists: true } });
            
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { _id: id._id, "dongle.model": oldDongle },
                { $pull: { dongle: { model: oldDongle } } },
                { new: true, multi: false }
            );
        }
        return res.status(200).send('Assets Removed Successfully')
    }
    catch(err){
        console.log(err);
    }
})

module.exports = router;