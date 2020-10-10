'use strict'

var mongoose = require('mongoose');
var https = require('https');
var fs = require('fs');


var app = require('./app');
var port = 3900;
var sec_port = 8443;
var privateKey = fs.readFileSync('vanlifers.key', 'utf-8');
var cert = fs.readFileSync('vanlifers.crt', 'utf-8');

var creds = {key : privateKey, cert : cert}

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_blog', {useNewUrlParser : true, useUnifiedTopology : true})
		.then(() => {
			console.log('La conexion a la base de datos se ha con exito')

			// Crear server y escuchar requests //
			app.listen(port, () => {
				console.log('Server corriendo en ' + port)
			})
			httpsServer.listen(sec_port);
			var httpsServer = https.createServer(creds, app, () => {
				console.log("Server corriendo en puerto " + port);
			});
		});
