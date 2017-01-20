var Field = require('./field');
var Figure = require('./figure');
var Rook = require('./rook');
var Chip = require('./chip');
var playerType = require('./playerType');

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
		return fields[x][y];
	}

	beat(x, y, attacker) {
		return fields[x][y].getFigure().beat(attacker);
	}

	//ToDo: Create intellignet algorithm for figure creation
	loadLevel(level) {
		console.log('Level', level);
		var newFigure = null;
		var board = level.board;
		for(var key in board) {
			var currentFigure = board[key];
			switch(currentFigure.type) {
				case 'CHIP':
					newFigure = new Chip(this, currentFigure.x, currentFigure.y, playerType.BOTH);
					this.fields[currentFigure.x][currentFigure.y].setFigure(newFigure);
					break;
				case 'ROOK': 
					newFigure = new Rook(this, currentFigure.x, currentFigure.y, currentFigure.color);
					this.fields[currentFigure.x][currentFigure.y].setFigure(newFigure);
					break;
				default:
					console.log('Invalid Figure in Level Data!')
					break;
			}
		}
	}
	
}

module.exports = Board;