var playerType = require('../../constants').playerType;
const gameType = require('../../constants').gameType;
const gameState = require('../../constants').gameState;
const winCondition = require('../../constants').winCondition;
const helper = require('../helper');

class GameEnd {
	constructor(board) {
		this.board = board;
		this.chips = [this.board.chips[0], this.board.chips[1], this.board.chips[2]];
		this.figures = this.board.figures;
		this.turnCount = 0;
		console.log("WinCondition created!");
	}

	isWin() {
		return gameState.VALID_TURN;
	}

	captureFigure(player, type) {
		this.figures[player]--;
	}

	captureChip(player, type) {
		var currentPlayer = null;
		if(player == playerType.PLAYERONE) {
			currentPlayer = playerType.PLAYERONE;
		} else if(player == playerType.PLAYERTWO) {
			currentPlayer = playerType.PLAYERTWO;
		}

		switch(type) {
			case playerType.PLAYERONE:  				//Yellow Chip
				this.chips[playerType.PLAYERONE]--;
				this.score[playerType.PLAYERTWO]++;
			break;
			case playerType.PLAYERTWO: 					//Blue Chip
				this.chips[playerType.PLAYERTWO]--;
				this.score[playerType.PLAYERONE]++;
			break;
			case playerType.BOTH: 						//Green Chip
				this.chips[playerType.BOTH]--;
				this.score[currentPlayer]++;
			break;
		}
	}

	countUpTurn() {
		this.turnCount++;
	}
};

module.exports = GameEnd;