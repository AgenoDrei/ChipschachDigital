var express = require('express');
var router = express.Router();
var validate = require("validate.js");

var gameConstraint = {
	type: {
		presence: true,
		format: {
			pattern: /(SP|MP|MINI)/
      	}
	},
	level: {
		presence: true
	},
	mode: {
		presence: true,
		format: {
		    pattern: /(beatable|unbeatable)/
        }
	}
};

module.exports = function(dataAccess, gameHandler) {
	router.post('/game', function(req, res, next) {
		console.log('API POST /game called!');
		var game = req.body;
		var validGame = validate(game, gameConstraint);
		if(validGame != undefined) {
			return res.status(500).json(validGame);
		}
		gameHandler.createGame(game).then(function(gameId) {
			return res.json({ gameId: gameId });
		}, function(err) {
			return res.status(500).json({ msg: err });
		});
	});

	router.get('/game', function(req, res, next) {
		console.log('API GET /game called');
		gameHandler.getGameList().then(function(games) {
			return res.json(games);
		}, function(err) {
			return res.status(500).json({ msg: err });
		});
	});

	router.get('/game/:gameId', function(req, res, next) {
		console.log('API GET /game/:gameId called');
		var gameId = req.params.gameId;
		if(gameId == undefined){
			return res.status(500).json({ msg: 'No gameId defined!' });
		}
		gameHandler.joinGame(gameId).then(function(joinId) {
			return res.json({ joinId: joinId, msg: "You joined the game successfull" });
		}, function(err){
			return res.status(500).json({ msg: err });
		});

	});

	return router;
};