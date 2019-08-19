'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
var secret = 'secret_key_mean_social_network';

exports.ensureAuth = (req, res, next) => {
  if(!req.headers.authorization)
    return res.status(403).send({message: "The request have not authentication header"});

  var token = req.headers.authorization.replace(/['"]+/g, '');

  try{
    var payload = jwt.decode(token, secret);

    if(payload.exp <= moment().unix())
      return res.status(401).send( {message: 'The token has expired'} );
  }catch(ex){
    return res.status(401).send( {message: 'The token is not valid'} );
  }

  req.user = payload;

  next();
}
