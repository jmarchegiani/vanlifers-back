'use strict'

// Cargar modulos de node para crear el servidor
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');

var privateKey = fs.readFileSync('vanlifers.key', 'utf-8');
var cert = fs.readFileSync('vanlifers.crt', 'utf-8');

var creds = {key : privateKey, cert : cert}

// Ejecutar express
var app = express();

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
        const auth = {login : 'vanlifers', password : 'eravo384agb74a3b7aTH'}

        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

        if (login && password && login === auth.login && password === auth.password) {
            // Access granted...
            return next()
        }
        res.set('WWW-Authenticate', 'Basic realm="401"');
        res.status(401).send('Authentication required.');
    }
    return next();
})
var httpsServer = https.createServer(app);

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

