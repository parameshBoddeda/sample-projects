var express = require('express');
var router = express.Router();

const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "2ff2a7b8e74549",
      pass: "56d141d32ca82d"
    }
  });
  
  router.post('/', (req, res) => {
    const { username, laptop, keyboard, mouse, headphone, dongle } = req.body;
    const mailOptions = {
      from: '2ff2a7b8e74549',
      to: 'boddeda.paramesh@gmail.com',
      subject: 'Assets Assigned',
      text: `Hi ${username} You got below Assets
      ${laptop ? laptop : ""}, ${keyboard ? keyboard : ""}, ${mouse ? mouse : ""}, ${headphone ? headphone : ""}, ${dongle ? dongle : ""}`
        
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Email sent');
      }
    });
  });
  
  module.exports = router;