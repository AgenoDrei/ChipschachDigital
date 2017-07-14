const Promise = require('promise');
const shortid = require('shortid');
const gameTypes = require('../constants').gameType;
const conStates = require('../constants').connectionState;
const gameStates = require('../constants').gameState;
const playerType = require('../constants').playerType;
const helper = require('../helper');
const Board = require('./gameBoard/gameBoard');
const Chip = require('./gameBoard/chip');
//var ProgressModel = require('./progressModel');
const GameEnd = require('./gameEnds/gameEnd');
const ChipGameEnd = require('./gameEnds/chipGameEnd');
const FigureGameEnd = require('./gameEnds/figureGameEnd');
const LastRowGameEnd = require('./gameEnds/lastRowGameEnd');
const GameEndManager = require('./gameEnds/gameEndManager');
const History = require('./history');


class Game {
	constructor(type, mode, local, level, name) {
		this.name = name;
		this.toBeNext = playerType.PLAYERONE;
		this.type = type;
		this.mode = mode;
		this.local = (local == 'true');
		this.level = level;
		this.id = shortid.generate();
		this.player1 = {
			connection: null,
			state: conStates.EMPTY,
			joinId: shortid.generate()
		};
		this.player2 = {
			connection: null,
			state: conStates.EMPTY,
			joinId: shortid.generate()
		};
		this.board = new Board(this);
		this.board.loadLevel(this.level);
		this.win = new GameEndManager();

		this.history = new History(this.board);
		console.log('New Game created with ID ' + this.id + ' and name ' + this.name + ', using level ' + this.level._id);
	}

	getId() {
		return this.id;
	}

	/*
	* Overwrite
	*/
	turn(origX, origY, destX, destY, player) {
	}

	undo() {
		return this.history.undo();
	}

    connect(joinId, connection) {
    	var player1 = this.player1;
    	var player2 = this.player2;
        return new Promise(function(fulfill, reject) {
            if (joinId == player1.joinId && player1.state == conStates.JOINED) {
                player1.connection = connection;
                player1.state = conStates.CONNECTED;
                fulfill(playerType.PLAYERONE);
            } else if (joinId == player2.joinId && player2.state == conStates.JOINED) {
                player2.connection = connection;
                player2.state = conStates.CONNECTED;
                fulfill(playerType.PLAYERTWO);
            }
            reject('Invalid joinId or already joined');
        });
    }

    sendToAll(message) {
		console.log("Server> ", message);
    	try {
    		this.player1.connection.sendUTF(JSON.stringify(message));
    		if(!this.local) this.player2.connection.sendUTF(JSON.stringify(message));
    	} catch(e) {
    		console.log('Error on sending to all in game...');
    	}
    }

    endGame() {
        console.log("Server> Game finished");
        this.sendToAll({type: "exit"});
    }

}

module.exports = Game;