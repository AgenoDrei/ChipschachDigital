const GameEnd = require('./gameEnd');
const playerType = require('../../constants').playerType;
const gameType = require('../../constants').gameType;
const gameState = require('../../constants').gameState;
const winCondition = require('../../constants').winCondition;
const figureType = require('../../constants').figureType;
const Pawn = require('../gameBoard/pawn');
const helper = require('../../helper');

class FigureReachFieldGameEnd extends GameEnd {
	constructor(board, figure, field, player) {
		super(board);
		this.winFigure = figure;
		this.winField = field;
		this.winPlayer = player;
	}

	isWin() {
		let curFigure = this.board.getField(this.winField.x,this.winField.y).getFigure();
		if(curFigure == null)
			return gameState.VALID_TURN;
		// console.log(curFigure.constructor.name);
		if(figureType[curFigure.constructor.name.toUpperCase()] == this.winFigure) {
			if(curFigure.player == this.winPlayer)
				return (this.winPlayer + 1);	// +1 such that transition from constants.playerType to constants.gameState !
		}
		return gameState.VALID_TURN;
	}
}

module.exports = FigureReachFieldGameEnd;