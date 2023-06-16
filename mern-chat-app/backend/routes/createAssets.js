var express = require('express');
var router = express.Router();
const AssetModel = require('../models/asset-model');

router.post('/', async (req, res) => {
    try {

        const { laptop, keyboard, mouse, headphone, dongle } = req.body;

        const laptopId = await AssetModel.findOne({ laptop: { $exists: true } })
        const laptopExist = await AssetModel.findOne({ _id: laptopId._id },
            { laptop: { $elemMatch: { model: laptop } } })
        const keyboardId = await AssetModel.findOne({ keyboard: { $exists: true } })
        const keyboardExist = await AssetModel.findOne({ _id: keyboardId._id },
            { keyboard: { $elemMatch: { model: keyboard } } })
        const mouseId = await AssetModel.findOne({ mouse: { $exists: true } })
        const mouseExist = await AssetModel.findOne({ _id: mouseId._id },
            { mouse: { $elemMatch: { model: mouse } } })
        const headphoneId = await AssetModel.findOne({ headphone: { $exists: true } })
        const headphoneExist = await AssetModel.findOne({ _id: headphoneId._id },
            { headphone: { $elemMatch: { model: headphone } } })
        const dongleId = await AssetModel.findOne({ dongle: { $exists: true } })
        const dongleExist = await AssetModel.findOne({ _id: dongleId._id },
            { dongle: { $elemMatch: { model: dongle } } })

        if (laptopExist.laptop?.length > 0
            || keyboardExist.keyboard?.length > 0
            || mouseExist.mouse?.length > 0
            || headphoneExist.headphone?.length > 0
            || dongleExist.dongle?.length > 0) {
            return res.status(400).send("Duplicate model No's are not Allowed")
        }

        if (!laptop && !keyboard && !mouse && !headphone && !dongle) {
            return res.status(400).send('Please Add Atleast One Assets ')
        }

        if (laptop) {
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { laptop: { $exists: true } },
                { $push: { laptop: { model: laptop, assigned: false } } },
                { new: true }
            );
        }
        if (keyboard) {
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { keyboard: { $exists: true } },
                { $push: { keyboard: { model: keyboard, assigned: false } } },
                { new: true }
            );
        }
        if (mouse) {
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { mouse: { $exists: true } },
                { $push: { mouse: { model: mouse, assigned: false } } },
                { new: true }
            );
        }
        if (headphone) {
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { headphone: { $exists: true } },
                { $push: { headphone: { model: headphone, assigned: false } } },
                { new: true }
            );
        }
        if (dongle) {
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { dongle: { $exists: true } },
                { $push: { dongle: { model: dongle, assigned: false } } },
                { new: true }
            );
        }
        return res.status(200).send('Assets Added Successfully')
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;