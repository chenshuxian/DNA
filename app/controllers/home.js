var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var jade = require('jade');
var router = express.Router(),
    Article = mongoose.model('Article');

module.exports = function(app) {
  app.use('/', router);
};

router.get('/', function(req, res, next) {
  Article.find(function(err, articles) {
    if (err) return next(err);
    res.render('index', {
      // title: 'Generator-Express MVC',
      title: 'DNA 前端核心 API',
      articles: articles
    });
  });
});

router.get('/js', function(req, res, next) {
  res.download('./public/js/bin/Dna.js');
});

router.get('/test', function(req, res, next) {
  Article.find(function(err, articles) {
    if (err) return next(err);
    res.render('indextest', {
      // title: 'Generator-Express MVC',
      title: 'DNA 測試前端核心 API',
      articles: articles
    });
  });
});

router.get('/json/:file', function(req, res, next) {
  var fileName = './public/js/test.json',
      getFile = req.params.file;
  // console.log(req.params.file);
  if (getFile === 'tree') {
    fileName = './public/js/tree.json';
  } else if (getFile === 'cb') {
    fileName = './public/js/cb.json';
  }

  fs.readFile(fileName, 'utf-8', function(err, data) {
    if (err) throw err;
    var json = JSON.parse(data);
    res.json(json);
  });
});

router.post('/jade', function(req, res, next) {
  // var html = jade.render('./app/views/edit.jade', options);
  // res.write(html);
  fs.readFile('./app/views/edit.jade', 'utf-8', function(err, data) {
    if (err) throw err;
    fs.writeFile('test.txt', data, function(err) {
      if (err) throw err;
    });
    var fn = jade.compile(data),
        html = fn();
    res.send(html);
  });
});

router.post('/add', function(req, res, next) {
  var data = {
    status: 'success',
    msg: '新增成功'
  };
  // data = JSON.parse(data);
  res.json(data);
});

router.post('/check', function(req, res, next) {
  var data = {
    status: 'confirm',
    msg: '重復是否繼續'
  };
  // data = JSON.parse(data);
  res.json(data);
});
