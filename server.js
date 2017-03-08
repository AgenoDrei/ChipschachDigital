var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoClient = require('mongodb').MongoClient;
var ejs = require('ejs');

var app = express();

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));    // TODO: insert favicon
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Deliver Frontend files - VIEW
app.use(express.static(path.join(__dirname, 'public')));
app.use('/graphics_engine', express.static(path.join(__dirname, 'graphics_engine'))); //ToDo: Remove when ported to angular
app.use('/libs', express.static(path.join(__dirname, 'node_modules')));

//Database and GameHandler initalization - MODEL 
var dataAccess = require('./model/dataAccess')(config, mongoClient);
var gameHandler = require('./model/gameHandler')(dataAccess);

//Route Definitions (REST Controller) - CONTROLLER
app.use('/api/v1', require('./controller/index'));
app.use('/api/v1', require('./controller/level')(dataAccess));
app.use('/api/v1', require('./controller/game')(dataAccess, gameHandler));

//set ejs and general view stuff
app.set('view engine', 'ejs');
app.set('views',__dirname + '/view');
app.set('view options', { layout:false, root: __dirname + '/' } );
require('./routes')(app, dataAccess, gameHandler);

//Websocket Controller
var communicationSocket = require('./controller/socketController')(config, gameHandler);

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
