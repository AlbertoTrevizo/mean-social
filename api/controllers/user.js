'use strict'

var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');
const jwt = require('../services/jwt');

function home(req, res){
  res.status(200).send({
    message: 'Hola mundo desde el servidor de NodeJS'
  })
}

function pruebas(req, res){
  res.status(200).send({
    message: 'Accion de pruebas en el servidor de NodeJS'
  })
}

function saveUser(req, res){
  var params = req.body;
  var user = new User();

  if (params.name && params.surname &&
    params.nick && params.email && params.password) {

    user.name = params.name;
    user.surname = params.surname;
    user.nick = params.nick;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = null;

    User.find({ $or: [ {email: user.email.toLowerCase()}, {nick: user.nick.toLowerCase()} ] }).exec( (err, users) => {
        if (err) return res.status(500).send({message: 'Error user request'});
        if (users && users.length >= 1) return res.status(500).send({message: 'The user already exists'})
        else {
          bcrypt.hash(params.password, null, null, (err, hash) => {
            user.password = hash;
            user.save((err, userStored) => {
              if (err) return res.status(500).send({message: 'Error al guardar el usuario'});

              if (userStored) {
                res.status(200).send({user: userStored});
              } else {
                res.status(404).send({message: 'No se ha registrado el usuario'})
              }
            })
          });
        }
    });

  }else {
    res.status(200).send({
      message: 'Envia todos los campos necesarios!'
    });
  }
}

function loginUser(req, res){
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne( {email: email}, (err, user) => {
    if (err) return res.status(500).send({message: 'Error request'});
    if (user) {
      bcrypt.compare(password, user.password, (err, check) => {
        if (check) {
          //Return user data
          if(params.getToken){
            return res.status(200).send({
              token: jwt.createToken(user)
            });
          } else {
            user.password = undefined;
            return res.status(200).send({user});
          }
        } else {
          res.status(404).send({message: 'The user can not logged in'});
        }
      });
    } else {
      res.status(404).send({message: 'The user can not logged in'});
    }
  });
}

function getUser(req, res){
  var userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) res.status(500).send({message: "Request error"});
    if (!user) res.status(404).send({message: "User not found"});

    return res.status(200).send({user});
  })
}

module.exports = {
  home,
  pruebas,
  saveUser,
  loginUser,
  getUser
}
