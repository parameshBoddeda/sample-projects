var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const generatToken = require('../config/generateToken');
const SignupModel = require('../models/signup-model');


/* GET home page. */
router.post('/', async function(req, res, next) {
  try{
    const {email,password} = req.body;
        const exist = await SignupModel.findOne({email});

        if( !email || !password){
          return res.status(400).send('Please Fill all the Fields');
           
         }

        if(!exist){
            return res.status(400).send('user does not exist')
        }
       if(password !== exist.password){
            return res.status(400).send('Invalid Password')
       }

      if(exist){
        return res.status(200).json({
          _id: exist._id,
          username: exist.username,
          email: exist.email,
          mobile: exist.mobile,
          pic: exist.pic,
          token: generatToken(exist._id)
        })
      }

        
  }
  catch(err){
    console.log(err);
  }
});

module.exports = router;