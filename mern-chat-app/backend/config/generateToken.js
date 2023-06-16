const jwt = require('jsonwebtoken');

const generatToken = (id) =>{
    return jwt.sign({id},'jwtToken',{
        expiresIn: '30d'
    })
}

module.exports = generatToken;
