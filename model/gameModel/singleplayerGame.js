const Game = require('./game');
const GameEnd = require('./gameEnds/gameEnd');
const ChipGameEnd = require('./gameEnds/chipGameEnd');
const gameTypes = require('../constants').gameType;
const conStates = require('../constants').connectionState;
const gameStates = require('../constants').gameState;
const playerType = require('../constants').playerType;
const helper = require('../helper');
const Board = require('./gameBoard/gameBoard');
const Chip = require('./gameBoard/chip');

class SingleplayerGame extends Game {
	constructor(type, mode, local, level, name) {
		super(type, mode, local, level, name);
		this.win.addGameEnd(new ChipGameEnd(this.board));
	}

	turn(origX, origY, destX, destY, player) {
		if(this.player1.state != conStates.CONNECTED) {
			return gameStates.PLAYER_DISCONNECTED;
		}
		if(this.board.getField(origX, origY).getFigure() == null || this.board.getField(origX, origY).getFigure() instanceof Chip) {
			return gameStates.INVALID_TURN;
		}
		var currentFigure = this.board.getField(origX, origY).getFigure();
		if(!currentFigure.checkRules(destX, destY)) {
			return gameStates.INVALID_TURN;
		} else {
			currentFigure.move(destX, destY);
		}
		this.win.countUpTurn();
		let winner = this.win.checkGameEnd();
		if(winner != gameStates.VALID_TURN) {
			return winner;
		}
		return gameStates.VALID_TURN;
	}
}

module.exports = SingleplayerGame;