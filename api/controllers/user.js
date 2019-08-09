'use strict'

var bcrypt = require('bcrypt-nodejs');

var User = require('../models/user');

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

  User.findOne({email: email, password: password}, (err, user) => {
    if (err) return res.status(500).send({message: 'Error request'});

    if (user) {

    }
  });
}

module.exports = {
  home,
  pruebas,
  saveUser
}
