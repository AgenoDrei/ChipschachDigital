const GameEnd = require('./gameEnd');

class LastRowGameEnd extends GameEnd {
	constructor(board) {
		super(board);
	}

	isWin() {
       for(let y = 1; y <= 8; y+=7) {
			for(let x = 1; x <= 8; x++) {
				let curFigure = this.board.getField(x,y).getFigure();
				if(curFigure == null)
					continue;
				if(curFigure.constructor.name == 'Pawn') {
					if(y == 1 && curFigure.player == playerType.PLAYERONE)
						return gameState.WIN_PLAYER1;
					if(y == 8 && curFigure.player == playerType.PLAYERTWO)
						return gameState.WIN_PLAYER2;
				}
			}
		}
		return gameState.VALID_TURN;
	}
}

module.exports = LastRowGameEnd;