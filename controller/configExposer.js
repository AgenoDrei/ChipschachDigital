var express = require('express');
var router = express.Router();
const constants = require('../model/constants');

module.exports = function(config) {	
	router.get('/', function(req, res, next) {
		console.log('API /config called!');
		let exposedConfig = {
		        server: config.server,
        		socket: config.socket
    		}
    		res.json(exposedConfig);
	});

	router.get('/constants', function(req, res, next) {
		res.send(constants);
	});

	return router;
}
