'use strict'

// Cargar modulos de node para crear el servidor
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express
var app = express();

// Middleware
app.use(express.json());
//app.use(bodyParser.urlencoded({extended:false}));


// Cargar ficheros rutas
var articleRoutes = require('./routes/article');

// CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// Añadir prefijos a rutas / cargar rutas
app.use('/', articleRoutes);

// Exportar modulo(fichero actual)
module.exports = app;

// ENDPOINTS //

