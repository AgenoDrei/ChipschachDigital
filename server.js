var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoClient = require('mongodb').MongoClient;

var app = express();

//set ejs and general view stuff
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
    var iconRows = [
        [
            {id:'sp', picId:'single', name:'Einzelspieler'},
            {id:'mp', picId:'multiLocal', name:'Lokaler Mehrspieler'},
            {id:'mini', picId:'mini', name:'Minischach'}
        ],[
            {id:'mp_g', picId:'multiGlobal', name:'Globaler Mehrspieler'},
            {id:'impressum', picId:'logoLg', name:''},
            {id:'classic', picId:'classic', name:'Klassisches Schach'}
        ],[
            {id:'', picId:'', name:''},
            {id:'editor', picId:'editor', name:'Editor'},
            {id:'', picId:'', name:''}
        ]
    ];
    var accTypes = [
        {id: 'sp', name: 'Lokaler Einzelspieler'},
        {id: 'mp', name: 'Lokaler Mehrspieler'},
        {id: 'mini', name: 'Minischach-Aufgaben'}
    ];
    var subtypes = [
        {id: 'pawn', name: 'Bauer'},
        {id: 'knight', name: 'Springer'},
        {id: 'bishop', name: 'Läufer'},
        {id: 'rook', name: 'Turm'},
        {id: 'queen', name: 'Dame'},
        {id: 'king', name: 'König'}
    ];

    res.render('menu', {
        iconRows: iconRows,
        accTypes: accTypes,
        subtypes: subtypes
    });
});

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));    // TODO: insert favicon
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Deliver Frontend files - VIEW
app.use(express.static(path.join(__dirname, 'views')));
app.use('/graphics_engine', express.static(path.join(__dirname, 'graphics_engine'))); //ToDo: Remove when ported to angular
app.use('/libs', express.static(path.resolve(__dirname, 'node_modules')));

//Database and GameHandler initalization - MODEL 
var dataAccess = require('./model/dataAccess')(config, mongoClient);
var gameHandler = require('./model/gameHandler')(dataAccess);

//Route Definitions (REST Controller) - CONTROLLER
app.use('/api/v1', require('./controller/index'));
app.use('/api/v1', require('./controller/level')(dataAccess));
app.use('/api/v1', require('./controller/game')(dataAccess, gameHandler));

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
