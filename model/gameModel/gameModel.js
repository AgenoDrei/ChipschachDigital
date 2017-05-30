var shortid = require('shortid');
var gameTypes = require('../constants').gameType;
var conStates = require('../constants').connectionState;
var gameStates = require('../constants').gameState;
var playerType = require('../constants').playerType;
var helper = require('../helper');
var Board = require('./gameBoard/gameBoard');
var Chip = require('./gameBoard/chip');
var ProgressModel = require('./progressModel');
var History = require('./history');


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
		this.win = new ProgressModel(this.board.chips[0], this.board.chips[1], this.board.chips[2], this.board.figures, this.board, this.type);
		this.history = new History(this.board);
		console.log('New Game created with ID: ', this.id);
		console.log('Level used: ', this.level._id);
        console.log('Level named: ', this.name);
	}

	getId() {
		return this.id;
	}

	turn(origX, origY, destX, destY, player) {
		if(this.player1.state != conStates.CONNECTED || (this.player2.state != conStates.CONNECTED && !this.local)) {
			return gameStates.PLAYER_DISCONNECTED;
		}
		if(this.board.getField(origX, origY).getFigure() == null || this.board.getField(origX, origY).getFigure() instanceof Chip) {
			return gameStates.INVALID_TURN;
		}
		if(this.toBeNext != player && !this.local) {
			return gameStates.INVALID_TURN;
		}
		var currentFigure = this.board.getField(origX, origY).getFigure();
		if(!currentFigure.checkRules(destX, destY)) {
			return gameStates.INVALID_TURN;
		} else {
			currentFigure.move(destX, destY);
		}
		this.win.countUpTurn();
		let winner = gameStates.VALID_TURN;
		if(this.type != gameTypes.MINI)
			winner = this.win.checkProgress();
		else
			winner = this.win.checkProgressMinichess(this.level.win);

		if(winner != gameStates.VALID_TURN) {
			return winner;
		}
		if(this.type != gameTypes.SP) {
			this.toBeNext = helper.getEnemy(this.toBeNext);
		}
		return gameStates.VALID_TURN;
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