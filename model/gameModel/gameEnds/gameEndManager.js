const gameState = require('../../constants').gameState;
const GameEnd = require('./gameEnd');
const ChipGameEnd = require('./chipGameEnd');
const FigureGameEnd = require('./figureGameEnd');
const LastRowGameEnd = require('./lastRowGameEnd');


class GameEndManager {
	constructor() {
		this.ends = [];
	}

	addGameEnd(end) {
		this.ends.push(end);
	}

	checkGameEnd() {
		for(let end of this.ends) {
			let win = end.isWin();
			if(win != gameState.VALID_TURN)
				return win;
		}
		return gameState.VALID_TURN;
	}

	captureFigure(player, type) {
		if(this.ends.length > 0)
			this.ends[0].captureFigure(player, type);
	}

	captureChip(player, type) {
		if(this.ends.length > 0)
			this.ends[0].captureChip(player, type);
	}

	countUpTurn() {
		for(let end of this.ends) {
			end.countUpTurn();
		}
	}

};

module.exports = GameEndManager;