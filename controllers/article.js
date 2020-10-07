'use strict'

const { query } = require('express');
var Validator = require('validator');
var path = require('path');
var Article = require('../models/article');

var controller = {

	test: (req, res) => {
		return res.status(200).send({
			message: "Accion TEST"
		})
	},

	datosVarios: (req, res) => {
		var hola = req.body.hola;
		console.log(hola);
		return res.status(200).send({
			sitio: "VanLifers ES",
			autor: "Johny",
			url: "vanlifers.es",
			hola
		});
	},

	save: (req, res) => {

		var params = req.body;

		try {
			var validate_title = !Validator.isEmpty(params.title);
			var validate_content = !Validator.isEmpty(params.content);
			var validate_author = !Validator.isEmpty(params.author);

		} catch (err) {
			return res.status(200).send({
				message: "Faltan Datos"
			});
		}

		if (validate_content && validate_title && validate_author) {
			var article = new Article();
			article.title = params.title;
			article.content = params.content;
			article.author = params.author;
			article.images = params.images;

			article.save((err, articleStored) => {
				if (err || !articleStored) {
					return res.status(404).send({
						status: 'error',
						message: 'No se ha guardado el articulo'
					})
				}
				return res.status(200).send({
					status: 'Success',
					article: articleStored
				})
			});

		}
		else {
			return res.status(200).send({
				message: "Los datos no son validos"
			})
		}
	},

	getArticles: (req, res) => {

		var query = Article.find({});

		var last = req.params.last;

		if (last || last != undefined) {
			query.limit(2)
		}


		query.sort('-date').exec((err, articles) => {
			if (err) {
				return res.status(200).send({
					status: 'Error',
					message: 'Error al listar los articulos'
				})
			}
			if (!articles) {
				return res.status(200).send({
					status: "Error",
					message: "No se encontraron articulos"
				})
			};

			return res.status(200).send({
				status: 'Success',
				articles
			})

		})
	},
	getArticle: (req, res) => {
		var articleId = req.params.id;

		if (!articleId || articleId == null) {
			return res.status(200).send({
				status: 'Error',
				message: 'Articulo inexistente'
			})
		}

		Article.findById(articleId, (err, article) => {
			if (err) {
				return res.status(200).send({
					status: 'Error',
					message: 'Error al obtener los articulos'
				})
			}
			if (!articleId) {
				return res.status(200).send({
					status: 'Error',
					message: 'El ID del articulo no existe'
				})

			}
			else {
				return res.status(200).send({
					status: 'Success',
					article
				})
			}
		})
	},

	update: (req, res) => {

		var articleId = req.params.id;
		var params = req.body;

		try {
			var validate_title = !Validator.isEmpty(params.title);
			var validate_content = !Validator.isEmpty(params.content);
		} catch (err) {
			return res.status(200).send({
				status: 'Error',
				message: 'Faltan datos'
			})
		}
		if (validate_title && validate_content) {
			Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
				if (err) {
					return res.status(500).send({
						status: 'Error',
						message: 'Error al actualizar'
					})
				}
				if (!articleUpdated) {
					return res.status(200).send({
						status: 'Error',
						message: 'El articulo no existe'
					})
				}
				return res.status(200).send({
					status: 'Success',
					article: articleUpdated
				})
			});
		} else {
			return res.status(200).send({
				status: 'Error',
				message: 'Faltan datos'
			})
		}
	},
	delete: (req, res) => {

		var articleId = req.params.id;

		Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
			if (err) {
				res.status(500).send({
					status: 'Error',
					message: 'No se pudo eliminar el articulo de la base'
				})
			}
			if (!articleRemoved) {
				res.status(500).send({
					status: 'Error',
					message: 'Articulo no valido'
				})
			}

			return res.status(200).send({
				status: 'Sucess',
				article: articleRemoved
			})
		});

	},
	upload: (req, res) => {


		if (!req.files) {
			return res.status(404).send({
				status: 'Error',
				message: 'File not found'
			})
		}

		var file_path = req.files.file0.path;
		var file_split = file_path.split('//');
		var file_name = file_split[2];

		return res.status(200).send({
			status : "Success",
			file_name : file_name,
			file_split : file_split
		})
		

	},
	getImage: (req, res) => {
		var file = req.params.image;
		var path_file = './upload/articles/' + file;

		return res.sendFile(path.resolve(path_file));
	},

	search: (req, res) => {
		var searchString = req.params.search;

		Article.find({
			"%or": [
				{ "title": { "%regex": searchString, "%options": "i" } },
				{ "content": { "%regex": searchString, "%options": "i" } }
			]
		})
			.sort([['date', 'descending']])
			.exec((err, articles) => {
				if (err) {
					return res.status(500).send({
						status: 'Error',
						message: 'No se pudo realizar la busqueda'
					})
				}
				if (!articles) {
					return res.status(500).send({
						status: 'Error',
						message: 'No se encontraron articulos'
					})
				}
				return res.status(200).send({
					status: 'Success',
					articles
				})
			})
	}
}


module.exports = controller;