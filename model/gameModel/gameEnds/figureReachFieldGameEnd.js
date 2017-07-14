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
		debugger;
		if(curFigure == helper.enumToCamelcaseString(this.winFigure, figureType)) {
			if(curFigure.player == this.winPlayer)
				return (ẃinPlayer + 1);
		}
		return gameState.VALID_TURN;
	}
}

module.exports = FigureReachFieldGameEnd;