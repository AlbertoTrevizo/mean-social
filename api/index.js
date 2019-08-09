'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3000;

mongoose.promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mean_social', { useNewUrlParser: true })
  .then(() => {
    console.log('Hola, La conexion se ha creado exitosamente');

    // crear servidor
    app.listen(port, () => {
      console.log('Servidor corriendo en http://localhost:3000');
    })

  })
  .catch(err => console.log(err));
