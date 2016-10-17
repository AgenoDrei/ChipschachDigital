var Promise = require('promise');
var Game = require('./gameModel');
var gameTypes = require('./gameTypes');

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
					if(games[i].player1 == null) {
						games[i].player1 = {
							state: 'joined',
							connection: null
						};
						fulfill('You joined as player 1');
					} else if(games[i].player2 == null && games[i].type != gameTypes.SP) {
						games[i].player2 = {
							state: 'joined',
							connection: null
						};
						fulfill('You joined as player 2');
					} else {
						reject('Game with id ' + gameId + ' full!')
					}
				}
			}
			reject('Game with id ' + gameId + ' not found!');
		});
	};

	this.getGame = function(gameId) {
		return new Promise(function(fulfill, reject) {
			for(var i = 0; i < games.length; i++){
				if(games[i].id == gameId) {
					fulfill(games[i]);
				}
			}
			reject('gameId not found');
		});
	};

	return this;
}