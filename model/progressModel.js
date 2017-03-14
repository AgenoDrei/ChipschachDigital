var playerType = require('./playerType');
var gameType = require('./gameTypes');
var gameState = require('./gameStates');
var helper = require('./helper');

class ProgressModel {
	constructor(p1, p2, p0, figures, type) {
		this.chips = [ p1, p2, p0 ];
		this.figures = figures;
		this.score = [0, 0];
		this.turnCount = 0;
		this.type = type;
		console.log("ProgressModel created with these Chips: ", p1, p2, p0);
	}

	checkProgress() {
		let figureWin = this.isFigureWin();
		let chipWin = this.isChipWin();
		if(chipWin != gameState.VALID_TURN)
			return chipWin;
		if(figureWin != gameState.VALID_TURN && this.type != gameType.SP)
			return figureWin;
		return gameState.VALID_TURN;
	}

	isChipWin() {
        if(this.chips[playerType.PLAYERTWO] == 0 && this.chips[playerType.BOTH] == 0
            && this.score[playerType.PLAYERONE] > this.score[playerType.PLAYERTWO]) {
            return gameState.WIN_PLAYER1;
        } else if(this.chips[playerType.PLAYERONE] == 0 && this.chips[playerType.BOTH] == 0
            && this.score[playerType.PLAYERONE] < this.score[playerType.PLAYERTWO]) {
            return gameState.WIN_PLAYER2;
        }
        return gameState.VALID_TURN;
	}

	isFigureWin() {
		if(this.figures[playerType.PLAYERONE] == 0)
			return gameState.WIN_PLAYER2;
		else if(this.figures[playerType.PLAYERTWO] == 0)
			return gameState.WIN_PLAYER1;
		return gameState.VALID_TURN;
	}

	captureFigure(player, type) {
		console.log('Figure captured: ', type);
		this.figures[player]--;
	}

	captureChip(player, type) {
		debugger;
		console.log("chip captured: ", player, type);
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
}

module.exports = ProgressModel;