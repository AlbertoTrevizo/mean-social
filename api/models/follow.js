'use strict'

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var FollowSchema = Schema({
  user: {type: Schema.ObjectId, ref:'User'},
  followed: {type: Schema.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Follow', FollowSchema);
