'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Cargar Rutas
var userRoutes = require('./routes/user');

// Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// cors

// rutas
app.use('/api', userRoutes);

// exportar
module.exports = app;
