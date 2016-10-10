var express = require('express');
var router = express.Router();
var validate = require("validate.js");

var levelConstraint = {
	type: {
		presence: true
	},
	name: {
		presence: true
	},
	description: {
		presence: true
	},
	board: {
		presence: true,
	}
}

module.exports = function(dataAccess) {	
	router.get('/level', function(req, res, next) {
		res.json("Foo");
	});


	router.post('/level', function(req, res, next) {
		var level = req.body;
		var validLevel = validate(level, levelConstraint);
		if(validLevel != undefined) {
			return res.status(500).json(validLevel);
		}
		console.log(dataAccess.createLevel);
		dataAccess.createLevel(level).then(function() {
			return res.send({ msg: 'Created Level successfull' });
		},
		function(err) {
			return res.status(500).json(err);
		})
	});

	return router;
}
