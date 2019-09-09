'use strict'

var bcrypt = require('bcrypt-nodejs');
const mongoosePaginate = require('mongoose-pagination');

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
                res.status(404).send({message: 'No se ha registrado el usuario'});
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

function getUsers(req, res){
  var currentUserId = req.user.sub;
  var page = 1;

  if (req.params.page)
    page = req.params.page;

  var itemsPerPage = 5;

  User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
    if (err) res.status(500).send({message: 'Request error'});
    if (!users) res.status(404).send({message: 'Users not found'});

    return res.status(200).send({
      users,
      total,
      pages: Math.ceil(total/itemsPerPage)
    });
  })
}

function updateUser(req, res){
  var userId = req.params.id;
  var update = req.body;

  delete update.password;

  if(userId != req.user.sub){
    res.status(403).send({message : 'You do not have the permissions to update user data'});
  }

  User.findByIdAndUpdate(userId, update, {new : true, useFindAndModify : false}, (err, userUpdate) => {
    if (err) res.status(500).send({message: 'Request error'});
    if (!userUpdate) return(400).send({message:'User update failed'});

    return res.status(200).send({user: userUpdate});
  })
}

function uploadImage(req, res){
  var userId = req.params.id;
  
}

module.exports = {
  home,
  pruebas,
  saveUser,
  loginUser,
  getUser,
  getUsers,
  updateUser
}
