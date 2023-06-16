var express = require('express');
const middleware = require('../midleware/middleware');
var router = express.Router();
const SignupModel = require('../models/signup-model');
const ChatModel = require('../models/chat-model');

const accessChat = router.post('/',middleware,async (req,res)=>{
    const {userId} = req.body;

    if(!userId){
        console.log('userId param not sent with request');
       return res.status(400)
    }

    var isChat = await ChatModel.find({
        isGroupChat: false,
        $and:[
            {users:{$elemMatch:{$eq: req.user._id}}},
            {users:{$elemMatch:{$eq: userId}}}
        ]
    })
    .populate('users', '-password')
    .populate('latestMessage');

    isChat = await SignupModel.populate(isChat,{
        path: 'latestMessage.sender',
        select: 'username pic email'
    });

    if(isChat.length > 0){
       return res.send(isChat[0]);
    }else{
        var chatData = {
            chatName : 'sender',
            isGroupChat: false,
            users: [req.user._id, userId]
        }
    }
    try{
        const createdChat = await ChatModel.create(chatData);
        const fullChat = await ChatModel.findOne({_id: createdChat._id}).populate(
            'users',
            '-password'
        );
       return res.status(200).json(fullChat) 
    }
    catch(err){
        console.log(err);
       return  res.status(400).send(err.message)
         
    }

})

const fetchChats = router.get('/',middleware, async (req, res) => {
    try {
      ChatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await SignupModel.populate(results, {
            path: "latestMessage.sender",
            select: "username pic email",
          });
          return res.status(200).send(results);
        });
    } catch (error) {
        console.log(err);
        return  res.status(400).send(error.message)
    }
  });

  const createGroupChat = router.post('/', middleware, async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
  
    var users = JSON.parse(req.body.users);
  
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  
    users.push(req.user);
  
    try {
      const groupChat = await ChatModel.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });
  
      const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
     return res.status(200).json(fullGroupChat);
    } catch (error) {
        console.log(err);
        return  res.status(400).send(error.message)
    }
  });

  const renameGroup = router.put('/', middleware, async (req, res) => {
    const { chatId, chatName } = req.body;
  
    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
        console.log(err);
        return  res.status(400).send('Chat not found')
    } else {
     return res.json(updatedChat);
    }
  });

  const removeFromGroup = router.put('/', middleware, async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const removed = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
        console.log(err);
        return  res.status(400).send('Chat not found');
    } else {
     return res.json(removed);
    }
  });

  const addToGroup = router.put('/', middleware, async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const added = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
        console.log(err);
        return  res.status(400).send('Chat not found');
    } else {
      return res.json(added);
    }
  });

  module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
  };