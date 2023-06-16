var express = require('express');
const middleware = require('../midleware/middleware');
var router = express.Router();
const SignupModel = require('../models/signup-model');

router.get('/',middleware ,async (req,res)=>{
    const keyword = req.query.search 
    ?
    {
        $or:[
            {username:{$regex: req.query.search, $options: 'i' }},
            {email:{$regex: req.query.search, $options: 'i' }},
        ]
    }
    : {} ;
  
    const users = await SignupModel.find(keyword).find({_id:{$ne: req.user._id}});
    return res.send(users)
  })

  module.exports = router;