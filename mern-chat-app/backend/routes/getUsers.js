var express = require('express');
var router = express.Router();
const SignupModel = require('../models/signup-model');

router.post('/', async (req,res)=>{
    try{
        const { email } = req.body;

        const findUser = await SignupModel.findOne({email});
        if(findUser){
        if(findUser.rolename === 'hr' || findUser.rolename === 'admin'){
           const allUsers = await SignupModel.find();
            res.status(200).send(allUsers);
        }
        if(findUser.rolename === 'user'){
            const getUser = await SignupModel.findOne({email});
            res.status(200).send(getUser); 
        }
    }

    }
    catch(err){
        console.log(err);
    }
})

module.exports = router;
