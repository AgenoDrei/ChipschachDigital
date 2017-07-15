const GameEnd = require('./gameEnd');
const playerType = require('../../constants').playerType;
const gameType = require('../../constants').gameType;
const gameState = require('../../constants').gameState;
const winCondition = require('../../constants').winCondition;

class ChipGameEnd extends GameEnd {
	constructor(board) {
		super(board);
	}

	isWin() {
		 if(this.chips[playerType.PLAYERTWO] == 0 && this.chips[playerType.BOTH] == 0
            && this.score[playerType.PLAYERONE] > this.score[playerType.PLAYERTWO]) {
            return gameState.WIN_PLAYER1;
        } else if(this.chips[playerType.PLAYERONE] == 0 && this.chips[playerType.BOTH] == 0
            && this.score[playerType.PLAYERONE] < this.score[playerType.PLAYERTWO]) {
            return gameState.WIN_PLAYER2;
        } else if(this.chips[playerType.PLAYERTWO] == 0 && this.chips[playerType.PLAYERONE] == 0 && this.chips[playerType.BOTH] == 0
            && this.score[playerType.PLAYERONE] == this.score[playerType.PLAYERTWO]) {
            return gameState.WIN_DRAW;
        }
        return gameState.VALID_TURN;
	}
}

module.exports = ChipGameEnd;