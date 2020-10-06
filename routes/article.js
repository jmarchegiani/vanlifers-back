'use strict'

var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir : './upload/articles'});


/* router.get('/test-de-controller', ArticleController.test()); */
router.get('/test', ArticleController.test);
router.post('/datos-varios', ArticleController.datosVarios);
router.post('/save', ArticleController.save);
router.get('/get-articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

module.exports = router;