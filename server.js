var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoClient = require('mongodb').MongoClient;

var app = express();

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));    // TODO: insert favicon
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Deliver Frontend files
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.use('/libs', express.static(path.resolve(__dirname, 'node_modules')));

//Database initalization
debugger;
var dataAccess = require('./model/dataAccess')(config, mongoClient);

//Route Definitions (REST Controller)
app.use('/api/v1', require('./controller/index'));
app.use('/api/v1', require('./controller/level'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//Set header for whole application
app.use(function (req, res, next) {
  res.header("Content-Type",'application/json');
  next();
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

module.exports = app;
