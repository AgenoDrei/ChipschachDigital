const GameEnd = require('./gameEnd');
const playerType = require('../../constants').playerType;
const gameType = require('../../constants').gameType;
const gameState = require('../../constants').gameState;
const winCondition = require('../../constants').winCondition;

class FigureGameEnd extends GameEnd {
	constructor(board) {
		super(board);
	}

	isWin() {
        if(this.figures[playerType.PLAYERONE] == 0)
            return gameState.WIN_PLAYER2;
        else if(this.figures[playerType.PLAYERTWO] == 0)
            return gameState.WIN_PLAYER1;
        return gameState.VALID_TURN;
	}
}

module.exports = FigureGameEnd;