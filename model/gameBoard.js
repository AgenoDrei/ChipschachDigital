var Field = require('./field');

class Board {
	constructor() {
		this.width = 8;
		this.height = 8;
		this.fields = [];
		for(var x = 1; x <= this.height; x++) {
			this.fields[x] = [];
			for(var y = 1; y <= this.width; y++) {
				this.fields[x][y] = new Field(x,y);
			}
		}
		console.log('New Chessboard created!');
	}

	getField(x, y) {
		//TODO: Setup Board
	}

	loadLevel(level) {
		var board = level.board;
		for(key in board) {
			//fields[board[key].x][board[key].y].setFigure();
		}
	}
	
}

module.exports = Board;