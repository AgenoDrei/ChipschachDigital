var Promise = require('promise');
var Game = require('./gameModel');
var gameTypes = require('./gameTypes');
var conStates = require('./connectionStates');

module.exports = function(dataAccess) {
	this.games = [];

	this.createGame = function(gameParameters) {
		return new Promise(function(fulfill, reject) {
			dataAccess.getLevelById(gameParameters.level).then(function(level) {
				var type = gameTypes[gameParameters.type];	
				var newGame = new Game(type, gameParameters.mode, level);

				games.push(newGame);

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
					} else if(games[i].player2.state == conStates.EMPTY && games[i].type != gameTypes.SP) {
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
	}


	return this;
}