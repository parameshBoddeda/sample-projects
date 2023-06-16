var express = require('express');
var router = express.Router();
const SignupModel = require('../models/signup-model');

router.get('/', async (req,res)=>{
    try{
        const  keyword  = req.query.username;

        const findUser = await SignupModel.findOne({username:keyword});
        if(findUser){
            return res.status(200).send(findUser)
        }
    }
    catch(err){
        console.log(err);
    }
})

module.exports = router;