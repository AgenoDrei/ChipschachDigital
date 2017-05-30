var playerType = require('./constants').playerType;
const gameType = require('./constants').gameType;
const gameState = require('./constants').gameState;
const helper = require('./helper');
const winCondition = require('./constants').winCondition;

class ProgressModel {
	constructor(p1, p2, p0, figures, board, type) {
		this.chips = [ p1, p2, p0 ];
		this.figures = figures;
		this.score = [0, 0];
		this.turnCount = 0;
		this.type = type;
		this.board = board;
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

	checkProgressMinichess(condition) {
		debugger;
		let figureWin = this.isFigureWin();
		let miniWin = gameState.VALID_TURN;
		switch (condition) {
			case winCondition.PAWN_TO_LAST_ROW:
				miniWin = this.isPawnLastRowWin();
				break;
			// case winCondition.FIG_TO_CENTER: 
			// 	miniWin = this.isFigOnFields([
			// 		{x:4,y:4},
			// 		{x:4,y:5},
			// 		{x:5,y:4},
			// 		{x:5,y:5}
			// 	]);
		}

        if(figureWin != gameState.VALID_TURN)
            return figureWin;
		if(miniWin != gameState.VALID_TURN)
			return miniWin;
        return gameState.VALID_TURN;
	}

	isPawnLastRowWin() {
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

	// isFigOnFields(fields) {
		
	// }

	isChipWin() {
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