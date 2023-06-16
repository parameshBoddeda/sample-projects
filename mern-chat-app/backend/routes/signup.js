var express = require('express');
const generatToken = require('../config/generateToken');
var router = express.Router();
const SignupModel = require('../models/signup-model')

/* GET home page. */
router.post('/', async function(req, res, next) {
  try{
    const {username, email, mobile, password, pic} = req.body;

    if(!username || !email || !mobile || !password){
     return res.status(400).send('Please Fill all the Fields');
      
    }

    const exist = await SignupModel.findOne({email});
        if(exist){
            return res.status(400).send('email already exist');
        }
        
        let newUser = new SignupModel({
            username,email,mobile,password,pic
        });
             newUser.save();
        return res.status(200).json({
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          mobile: newUser.mobile,
          pic: newUser.pic,
          token: generatToken(newUser._id)
        });
  }
  catch(err){
    console.log(err);
  }
});



module.exports = router;