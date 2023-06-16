var express = require('express');
var router = express.Router();
const SignupModel = require('../models/signup-model');

router.get('/', async (req,res)=>{
    try{
        const  keyword  = req.query.search;

        if(keyword === 'all'){
           const allUsers = await SignupModel.find();
            res.status(200).send(allUsers);
        }
        if(keyword === 'enable'){
            const enableUsers = await SignupModel.find({"enabled":true});
            res.status(200).send(enableUsers); 
        }
        if(keyword === 'disable'){
            const disableUsers = await SignupModel.find({"enabled":false});
            res.status(200).send(disableUsers); 
        }
    

    }
    catch(err){
        console.log(err);
    }
})

module.exports = router;
