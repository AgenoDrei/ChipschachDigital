var shortid = require('shortid');
var gameTypes = require('./gameTypes');
var Promise = require('promise');
var conStates = require('./connectionStates');
var Board = require('./gameBoard');



class Game {
	constructor(type, mode, level) {
		this.type = type;
		this.mode = mode;
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
		this.board = new Board();
		this.board.loadLevel(level);
		console.log('New Game created with ID: ', this.id);
		console.log('Level used: ', this.level._id);
	}

	getId() {
		return this.id;
	}

	turn() {
		//TODO: Implement Game Logics
		return 0;
	}

    connect(joinId, connection) {
    	var player1 = this.player1;
    	var player2 = this.player2;
    	debugger;
        return new Promise(function(fulfill, reject) {
        	debugger;
            if (joinId == player1.joinId && player1.state == conStates.JOINED) {
                player1.connection = connection
                player1.state = conStates.CONNECTED;
                fulfill('Player 1');
            } else if (joinId == player2.joinId && player2.state == conStates.JOINED) {
                player1.connection = connection
                player2.state = conStates.CONNECTED;
                fulfill('Player 2');
            }
            reject('Invalid joinId or already joined');
        });
    }

    endGame() {
    	try {
    		player1.connection.sendUTF('{"type": "exit"}');
    		player1.connection.sendUTF('{"type": "exit"}');
    	} catch(e) {
    	}
    }

}

module.exports = Game;