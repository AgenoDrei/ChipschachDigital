var Promise = require('promise');
var Game = require('./gameModel');
var gameTypes = require('./gameTypes');
var conStates = require('./connectionStates');
var playerType = require('./playerType');
var gameState = require('./gameStates');
var helper = require('./helper');

module.exports = function(dataAccess) {
	this.games = [];

	this.createGame = function(gameParameters) {
		return new Promise(function(fulfill, reject) {
			dataAccess.getLevelById(gameParameters.level).then(function(level) {
				var type = gameTypes[gameParameters.type];
				var newGame = new Game(type, gameParameters.mode, gameParameters.local, level);

				this.games.push(newGame);

				fulfill(newGame.getId());
			}, 
			function(err) {
				reject(err);
			});
		});
	};

	this.getGameList = function() {
		return new Promise(function(fulfill, reject) {
			var filteredGames = [];
			for(var i = 0; i < games.length; i++) {
				filteredGames.push({ id: games[i].id, level: games[i].level._id });
			}
			fulfill(filteredGames);
		});
	};

	this.joinGame = function(gameId) {
		return new Promise(function(fulfill, reject) {
			for(var i = 0; i < games.length; i++) {
				if(games[i].id == gameId) {
					if(games[i].player1.state == conStates.EMPTY) {
						games[i].player1.state = conStates.JOINED;
						fulfill(games[i].player1.joinId);
					} else if(games[i].player2.state == conStates.EMPTY) {
						games[i].player2.state = conStates.JOINED;
						fulfill(games[i].player2.joinId);
					} else {
						reject('Game with id ' + gameId + ' full!');
					}
				}
			}
			reject('Game with id ' + gameId + ' not found!');
		});
	};

	this.getGame = function(gameId) {
		return new Promise(function(fulfill, reject) {
			if(gameId == null || gameId == undefined) 
				reject('gameId not found!');
			for(var i = 0; i < games.length; i++){
				if(games[i].id == gameId) {
					fulfill(games[i]);
				}
			}
			reject('gameId not found!');
		});
	};

	//TODO: Remove gameID
	this.turn = function(gameId, joinId, connection, origX, origY, destX, destY) {
		var resTurn = -99;
		return new Promise(function(fulfill, reject) {
			getGame(gameId).then(
				function(game) {
					var currentPlayer = helper.determinePlayer(connection, joinId, game.player1, game.player2);
					if(currentPlayer != playerType.NONE) {
						resTurn = game.turn(origX, origY, destX, destY, currentPlayer);
					} else {
						reject('could not match player to game!');
					}
					if(resTurn < 0) {
						reject(helper.enumToString(gameState, resTurn));
					}
					//fulfill(helper.enumToString(gameState, resTurn));
					fulfill(resTurn);
				},
				function() {
					reject('gameId not found!');
				});
		});
	};

	this.sendToAll = function(gameId, message) {
		getGame(gameId).then(function(game) {
			game.sendToAll(message);
		},
		function(err) {
			console.log("Problem?");
		});
	};

	this.endGame = function(gameId) {
		return new Promise(function(fulfill, reject) {
			for(var i = 0; i < games.length; i++){
				if(games[i].id == gameId) {
					games[i].endGame();
					games = games.splice(i, 1);
					fulfill('Game ended successfull!');
				}
			}
			reject('gameId not found');
		});
	};
	return this;
};