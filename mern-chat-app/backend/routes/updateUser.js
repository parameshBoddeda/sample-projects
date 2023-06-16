var express = require('express');
var router = express.Router();
const SignupModel = require('../models/signup-model');

router.put('/', async (req,res)=>{
    try{
        const keyword = req.query.username 
        const { username, email, mobile, rolename } = req.body;
        if(keyword){
            const updateUser = await SignupModel.findOneAndUpdate({username:keyword},req.body,{new:true},(err,model)=>{
                if(err){
                    return res.status(400).send(err)
                }
                if(!model){
                    return res.status(400).send('user not found')
                }
                return res.status(200).send('Data Updated Successfully')
            })
        }
    }
    catch(err){
        console.log(err);
    }
})

module.exports = router;