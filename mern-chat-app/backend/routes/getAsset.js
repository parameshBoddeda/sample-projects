var express = require('express');
var router = express.Router();
const AssetModel = require('../models/asset-model');


router.put('/', async (req, res) => {
    try {
        const { laptop, keyboard, mouse, headphone, dongle } = req.body;

        let value = laptop || keyboard || mouse || headphone || dongle
        if (value) {
            const id = await AssetModel.findOne({ [value]: { $exists: true } })
            var newDoc = await AssetModel.findOne({ _id: id._id },
                { [value]: { $elemMatch: { assigned: false } } })
            const updatedAsset = await AssetModel.findOneAndUpdate(
                { _id: id._id, [`${value}.assigned`]: false },
                { $set: { [`${value}.$.assigned`]: true } },
                { multi: false, new: true, returnOriginal: false }
            );
            return res.status(200).send(newDoc)
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).send(err)
    }
})

module.exports = router;