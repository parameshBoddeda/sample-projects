var express = require('express');
var router = express.Router();
const AssetModel = require('../models/asset-model');

router.get('/', async (req,res)=>{
    try{
        const assetList = await AssetModel.find();
        if(assetList){
            return res.status(200).send(assetList);
        }
    }
    catch(err){
        return res.status(500).send(err)
    }
})

module.exports = router;