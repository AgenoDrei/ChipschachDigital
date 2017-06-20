const Game = require('./game');
const GameEnd = require('./gameEnds/gameEnd');
const ChipGameEnd = require('./gameEnds/chipGameEnd');
const FigureGameEnd = require('./gameEnds/figureGameEnd');
const gameTypes = require('../constants').gameType;
const conStates = require('../constants').connectionState;
const gameStates = require('../constants').gameState;
const playerType = require('../constants').playerType;
const helper = require('../helper');
const Board = require('./gameBoard/gameBoard');
const Chip = require('./gameBoard/chip');

class MultiplayerGame extends Game {
	constructor(type, mode, local, level, name) {
		super(type, mode, local, level, name);
		this.win.addGameEnd(new ChipGameEnd(this.board));
		if(this.mode == 'beatable')
			this.win.addGameEnd(new FigureGameEnd(this.board));

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
		let winner = this.win.checkGameEnd();
		if(winner != gameStates.VALID_TURN) {
			return winner;
		}
		this.toBeNext = helper.getEnemy(this.toBeNext);
		return gameStates.VALID_TURN;
	}
}

module.exports = MultiplayerGame;