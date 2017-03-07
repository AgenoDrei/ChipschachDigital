var playerType = require('./playerType');
var gameState = require('./gameStates');

class ProgressModel {
	constructor(p1, p2, p0) {
		this.chips = [ p1, p2, p0 ];
		this.score = [0, 0];
		this.turnCount = 0;
		console.log("ProgressModel created with these Chips: ", p1, p2, p0);
	}

	checkProgress() {
		if(this.chips[playerType.PLAYERTWO] == 0 && this.chips[playerType.BOTH] == 0 
			&& this.score[playerType.PLAYERONE] > this.score[playerType.PLAYERTWO]) {
			return gameState.WIN_PLAYER1;
		} else if(this.chips[playerType.PLAYERONE] == 0 && this.chips[playerType.BOTH] == 0 
			&& this.score[playerType.PLAYERONE] < this.score[playerType.PLAYERTWO]) {
			return gameState.WIN_PLAYER2;
		}
		return gameState.VALID_TURN;
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
				this.score[playerType.PLAYERONE]++;
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