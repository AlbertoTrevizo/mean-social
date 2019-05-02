'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
  name: String,
  sruname: String,
  nick: String,
  email: String,
  password: String,
  role: String,
  image: String
});

module.exports = mongoose.model('User', UserSchema);
