var express = require('express');
var router = express.Router();
const UserAssetModel = require('../models/userAsset-model');

router.post('/', async (req, res) => {
    try {
        const { username, laptop, keyboard, mouse, headphone, dongle } = req.body;

        if (!laptop && !keyboard && !mouse && !headphone && !dongle) {
            return res.status(400).send('Please Assign Atleast one Asset ');
        }
       
        const exist = await UserAssetModel.find({username});
        if(exist.length > 0){
            if(keyboard){
                const updatedAsset = await UserAssetModel.findOneAndUpdate(
                    {username},
                    {$set : { "keyboard" : keyboard }},
                    {multi: false, new: true}
                )
            }
            if(mouse){
                const updatedAsset = await UserAssetModel.findOneAndUpdate(
                    {username},
                    {$set : { "mouse" : mouse }},
                    {multi: false, new: true}
                )
            }
            if(headphone){
                const updatedAsset = await UserAssetModel.findOneAndUpdate(
                    {username},
                    {$set : { "headphone" : headphone }},
                    {multi: false, new: true}
                )
            }
            if(dongle){
                const updatedAsset = await UserAssetModel.findOneAndUpdate(
                    {username},
                    {$set : { "dongle" : dongle }},
                    {multi: false, new: true}
                )
            }
            if(laptop){
                const updatedAsset = await UserAssetModel.findOneAndUpdate(
                    {username},
                    {$set : { "laptop" : laptop }},
                    {multi: false, new: true}
                )
            }
            return res.status(200).send('Assets Assigned Successfully')
        }

        
        
        
            let newUser = new UserAssetModel({
                username, laptop, keyboard, mouse, headphone, dongle
            });
            newUser.save();
            return res.status(200).send('Assets Assigned Successfully')
        
    }
    catch (err) {
        return res.status(500).send(err)
    }
})

module.exports = router;