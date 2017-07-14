const Promise = require('promise');
const gameType = require('./constants').gameType;
const conStates = require('./constants').connectionState;
const playerType = require('./constants').playerType;
const gameState = require('./constants').gameState;
const SingleplayerGame = require('./gameModel/singleplayerGame');
const MultiplayerGame = require('./gameModel/multiplayerGame');
const MinichessGame = require('./gameModel/minichessGame');
const helper = require('./helper');

module.exports = function(dataAccess) {
	this.games = [];

	this.createGame = function(gameParameters) {
		return new Promise(function(fulfill, reject) {
			dataAccess.getLevelById(gameParameters.level).done(function(level) {
				var type = gameType[gameParameters.type];
				let newGame = null;
				switch(type) {
					case gameType.SP:
						newGame = new SingleplayerGame(type, gameParameters.mode, gameParameters.local, level, gameParameters.name);
					break;
					case gameType.MP:
						newGame = new MultiplayerGame(type, gameParameters.mode, gameParameters.local, level, gameParameters.name);
					break;
					case gameType.MINI:
						newGame = new MinichessGame(type, gameParameters.mode, gameParameters.local, level, gameParameters.name);

					break;
					default:
					reject('Invalid game type')
				}
				//var newGame = new Game(type, gameParameters.mode, gameParameters.local, level, gameParameters.name);

				this.games.push(newGame);

				fulfill(newGame.getId());
			}, 
			function(err) {
				reject(err);
			});
		});
	};

	this.getGameList = function() {		// gets all globalMP games with stats for lobby in menu
		return new Promise(function(fulfill, reject) {
			var filteredGames = [];
			for(var i = 0; i < games.length; i++) {
				if (games[i].local)
					continue;

				let filledSeats = 0;
				if (games[i].player1.state !== conStates.EMPTY)
                    filledSeats++;
                if (games[i].player2.state !== conStates.EMPTY)
                    filledSeats++;
				filteredGames.push({
					id: games[i].id,
					level: games[i].level.name,
					levelId: games[i].level._id,
					mode: games[i].mode,
					name: games[i].name,
                    filledSeats: filledSeats
				});
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
			getGame(gameId).done(
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

	this.yield = function(gameId, joinId) {
		return new Promise(function(fulfill, reject) {
			getGame(gameId).done(
				function(game) {
                    var currentPlayer = helper.determinePlayer(null, joinId, game.player1, game.player2);
					fulfill(currentPlayer);
                },
				function () {
                    reject('gameId not found!');
                });
		});
	};

	this.undo = function (gameId, joinId) {
        return new Promise(function(fulfill, reject) {
            getGame(gameId).done(
                function(game) {
                    fulfill(game.undo());
                },
                function () {
                    reject('gameId not found!');
                });
        });
    };

	this.sendToAll = function(gameId, message) {
		getGame(gameId).done(function(game) {
			game.sendToAll(message);
		},
		function(err) {
			console.log("Problem?");
		});
	};

	this.endGame = function(connection) {
		return new Promise(function(fulfill, reject) {
            for(let key in this.games) {
            	let obj = this.games[key];
                if(obj.player1.connection == connection || obj.player2.connection == connection) {
                    obj.endGame();
                    obj.player1.state = obj.player2.state = conStates.LEFT;
                    this.games.splice(key, 1);
                    fulfill('Game ended successfull!');
                }
            }
            reject('game not found');
		});
	};
	return this;
};