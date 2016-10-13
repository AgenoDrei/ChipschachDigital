var Promise = require('promise');
var Game = require('./gameModel');

module.exports = function(dataAccess) {
	this.games = [];

	this.createGame = function(gameParameters) {
		return new Promise(function(fulfill, reject) {
			dataAccess.getLevelById(gameParameters.level).then(function(level) {				
				var newGame = new Game(gameParameters.type, gameParameters.mode, level);

				games.push(newGame);

				fulfill(newGame.getId());
			}, 
			function(err) {
				reject(err);
			});
		});
	};

	return this;
}