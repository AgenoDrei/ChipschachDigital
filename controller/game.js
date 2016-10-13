var express = require('express');
var router = express.Router();
var validate = require("validate.js");

var gameConstraint = {
	type: {
		presence: true
	},
	level: {
		presence: true
	},
	mode: {
		presence: true,
	}
};

module.exports = function(dataAccess, gameHandler) {
	router.post('/game', function(req, res, next) {
		console.log('API POST /game called!');;
		var game = req.body;
		var validGame = validate(game, gameConstraint);
		if(validGame != undefined) {
			return res.status(500).json(validGame);
		}
		var gameId = gameHandler.createGame(game).then(function(gameId) {
			return res.json({ gameId: gameId });
		}, function(err) {
			return res.status(500).json({ msg: err });
		});
	});

	return router;
};