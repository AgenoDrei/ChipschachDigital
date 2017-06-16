const GameEnd = require('./gameEnd');

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