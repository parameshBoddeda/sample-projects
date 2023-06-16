const jwt = require('jsonwebtoken');
const SignupModel = require('../models/signup-model')

module.exports = async function (req, res, next) {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            let decoded = jwt.verify(token, 'jwtToken');
            req.user = await SignupModel.findById(decoded.id).select('-password');
            next();

        }
        catch (err) {
            console.log(err);
            return res.status(400).send('authentication error')
        }
    }
    if(!token){
       return res.status(400).send('Token not found')
    }
}