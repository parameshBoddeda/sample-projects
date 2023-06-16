var express = require('express');
var router = express.Router();
const UserAssetModel = require('../models/userAsset-model');

router.get('/', async (req, res)=>{
    try{

        const keyword = req.query.username;

        if(keyword){
            const exist = await UserAssetModel.find({username:keyword});
            
            if(exist.length <= 0){
                return res.status(400).send('user does not have any assets')
            }
            else{
                return res.status(200).send(exist)
            } 
        }else {
            const exist = await UserAssetModel.find();
            return res.status(200).send(exist)
        }
        

    }
    catch(err){
        return res.status(500).send(err)
    }
})

module.exports = router;