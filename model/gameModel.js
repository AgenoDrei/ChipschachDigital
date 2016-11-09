var shortid = require('shortid');
var gameTypes = require('./gameTypes');
var Promise = require('promise');
var conStates = require('./connectionStates');
var Board = require('./gameBoard');
var Chip = require('./chip');
var playerType = require('./playerType');
var helper = require('./helper');


class Game {
	constructor(type, mode, level) {
		this.toBeNext = playerType.PLAYERONE;
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
		this.board.loadLevel(this.level);
		console.log('New Game created with ID: ', this.id);
		console.log('Level used: ', this.level._id);
	}

	getId() {
		return this.id;
	}

	//TODO: Test for win
	turn(origX, origY, destX, destY, player) {
		if(this.player1.state != conStates.CONNECTED || (this.player2.state != conStates.CONNECTED && this.type != gameTypes.SP)) {
			return gameStates.PLAYER_DISCONNECTED;
		}
		if(this.board.getField(origX, origY).getFigure() == null || this.board.getField(origX, origY).getFigure() instanceof Chip) {
			return gameStates.INVALID_TURN;
		}
		if(this.toBeNext != player) {
			return gameStates.INVALID_TURN;
		}
		var currentFigure = this.board.getField(origX, origY).getFigure();
		if(!currentFigure.move(destX, destY)) {
			return gameStates.INVALID_TURN;
		}
		this.toBeNext = helper.getEnemy(this.toBeNext);
		//TODO: Implement Game Logics
		return gameStates.VALID_TURN;
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

    //ToDo: Refactor
    sendToAll(message) {
    	try {
    		player1.connection.sendUTF(message);
    		player1.connection.sendUTF(message);
    	} catch(e) {
    	}
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