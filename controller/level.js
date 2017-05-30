var express = require('express');
var router = express.Router();
var validate = require("validate.js");

var levelConstraint = {
	type: {
		presence: true
	},
	_id: {
		presence: true
	},
	description: {
		presence: true
	},
	board: {
		presence: true,
	}
};

module.exports = function(dataAccess) {	

	router.get('/level/:levelId', function(req, res, next) {
		console.log('API GET /level/:levedId called!');
		var levelId = req.params.levelId;
		if(levelId == undefined) {
			return res.status(500).json({ msg: 'You have to specify a level name'});
		}

		dataAccess.getLevelById(levelId).done(function(level) {
			return res.json(level);
		},
		function(err) {
			return res.status(500).json({ msg: err });
		});

		
	});

	router.get('/level', function(req, res, next) {
		console.log('API /level/all called!');
		dataAccess.getAllLevelIds().done(function(ids) {
			return res.json(ids);
		},

		function(err) {
			return res.status(500).json({ msg: err });
		});
	});

	router.post('/level', function(req, res, next) {
		console.log('API POST /level/ called!');
		var level = req.body;
		var validLevel = validate(level, levelConstraint);
		if(validLevel != undefined) {
			return res.status(500).json(validLevel);
		}
		//console.log(dataAccess.createLevel);
		dataAccess.createLevel(level).done(function() {
			return res.send({ msg: 'Created Level successfull' });
		},
		function(err) {
			return res.status(500).json({ msg: err });
		})
	});

	return router;
}
