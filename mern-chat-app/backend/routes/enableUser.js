var express = require('express');
var router = express.Router();
const SignupModel = require('../models/signup-model');

router.put('/', async (req,res)=>{
    try{
        const keyword = req.query.username; 
        const { enabled } = req.body;
        if(keyword){
            const updatedUser = await SignupModel.findOneAndUpdate({username:keyword},{$set:{enabled:enabled}},{new:true});
            if(!updatedUser){
                return res.status(404).send('user not found')
            }
            return res.status(200).send('Data Updated Successfully')
        }
        return res.status(400).send('username is missing')
    }
    catch(err){
        console.log(err);
        return res.status(500).send(err)
    }
});

module.exports = router;
