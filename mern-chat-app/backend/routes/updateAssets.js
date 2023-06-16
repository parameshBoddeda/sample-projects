var express = require('express');
var router = express.Router();
const AssetModel = require('../models/asset-model');

router.put('/', async (req, res) => {
    try {

        const { laptop, keyboard, mouse, headphone, dongle,
            oldLaptop, oldKeyboard, oldMouse, oldHeadphone, oldDongle
        } = req.body;

        if (laptop !== oldLaptop) {
            const laptopId = await AssetModel.findOne({ laptop: { $exists: true } })
            var laptopExist = await AssetModel.findOne({ _id: laptopId._id },
                { laptop: { $elemMatch: { model: laptop } } })
        }
        if (keyboard !== oldKeyboard) {
            const keyboardId = await AssetModel.findOne({ keyboard: { $exists: true } })
            var keyboardExist = await AssetModel.findOne({ _id: keyboardId._id },
                { keyboard: { $elemMatch: { model: keyboard } } })
        }
        if (mouse !== oldMouse) {
            const mouseId = await AssetModel.findOne({ mouse: { $exists: true } })
            var mouseExist = await AssetModel.findOne({ _id: mouseId._id },
                { mouse: { $elemMatch: { model: mouse } } })
        }
        if (headphone !== oldHeadphone) {
            const headphoneId = await AssetModel.findOne({ headphone: { $exists: true } })
            var headphoneExist = await AssetModel.findOne({ _id: headphoneId._id },
                { headphone: { $elemMatch: { model: headphone } } })
        }
        if (dongle !== oldDongle) {
            const dongleId = await AssetModel.findOne({ dongle: { $exists: true } })
            var dongleExist = await AssetModel.findOne({ _id: dongleId._id },
                { dongle: { $elemMatch: { model: dongle } } })
        }


        if (laptopExist?.laptop?.length > 0
            || keyboardExist?.keyboard?.length > 0
            || mouseExist?.mouse?.length > 0
            || headphoneExist?.headphone?.length > 0
            || dongleExist?.dongle?.length > 0) {
            return res.status(400).send("Duplicate model No's are not Allowed")
        }

        if (!laptop && !keyboard && !mouse && !headphone && !dongle
            && !oldLaptop && !oldKeyboard && !oldMouse && !oldHeadphone && !oldDongle
        ) {
            return res.status(400).send('Please Add Atleast One Assets ')
        }

        if (laptop && oldLaptop) {
            const id = await AssetModel.findOne({ laptop: { $exists: true } });

            var updatedLaptop = await AssetModel.findOneAndUpdate(
                { _id: id._id, "laptop.model": oldLaptop },
                { $set: { "laptop.$.model": laptop } },
                { new: true, multi: false }
            );
        }
        if (keyboard && oldKeyboard) {
            const id = await AssetModel.findOne({ keyboard: { $exists: true } });

            var updatedKeyboard = await AssetModel.findOneAndUpdate(
                { _id: id._id, "keyboard.model": oldKeyboard },
                { $set: { "keyboard.$.model": keyboard } },
                { new: true, multi: false }
            );
        }
        if (mouse && oldMouse) {
            const id = await AssetModel.findOne({ mouse: { $exists: true } });

            var updatedMouse = await AssetModel.findOneAndUpdate(
                { _id: id._id, "mouse.model": oldMouse },
                { $set: { "mouse.$.model": mouse } },
                { new: true, multi: false }
            );
        }
        if (headphone && oldHeadphone) {
            const id = await AssetModel.findOne({ headphone: { $exists: true } });

            var updatedHeadphone = await AssetModel.findOneAndUpdate(
                { _id: id._id, "headphone.model": oldHeadphone },
                { $set: { "headphone.$.model": headphone } },
                { new: true, multi: false }
            );
        }
        if (dongle && oldDongle) {
            const id = await AssetModel.findOne({ dongle: { $exists: true } });

            var updatedDongle = await AssetModel.findOneAndUpdate(
                { _id: id._id, "dongle.model": oldDongle },
                { $set: { "dongle.$.model": dongle } },
                { new: true, multi: false }
            );
        }
        if(updatedLaptop || updatedKeyboard || updatedMouse || updatedHeadphone || updatedDongle){
            return res.status(200).send('Assets Added Successfully')
        }
        
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;