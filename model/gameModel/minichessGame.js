const Game = require('./game');
const GameEnd = require('./gameEnds/gameEnd');
const FigureGameEnd = require('./gameEnds/figureGameEnd');
const LastRowGameEnd = require('./gameEnds/lastRowGameEnd');
const FigureReachFieldGameEnd = require('./gameEnds/figureReachFieldGameEnd');
const gameTypes = require('../constants').gameType;
const conStates = require('../constants').connectionState;
const gameStates = require('../constants').gameState;
const playerType = require('../constants').playerType;
const winCondition = require('../constants').winCondition;
const helper = require('../helper');
const Board = require('./gameBoard/gameBoard');
const Chip = require('./gameBoard/chip');

class MinichessGame extends Game {
	constructor(type, mode, local, level, name) {
		super(type, mode, local, level, name);
		this.win.addGameEnd(new FigureGameEnd(this.board));
		switch(level.win) {
			case winCondition.PAWN_TO_LAST_ROW:
				this.win.addGameEnd(new LastRowGameEnd(this.board));
				break;
			case winCondition.FIG_REACHES_FIELD:
				this.win.addGameEnd(new FigureReachFieldGameEnd(this.board, level.winSpecs.figure, level.winSpecs.field, level.winSpecs.player))
			default:
		}
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

module.exports = MinichessGame;