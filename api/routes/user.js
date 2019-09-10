'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './uploads/users'})

api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);
api.put('/user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/user/image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/user/image/:imageFile', md_auth.ensureAuth, UserController.getImageFile);

module.exports = api;
