var Field = require('./field');
var Figure = require('./figure');
var Rook = require('./rook');
var Bishop = require('./bishop');
var Knight = require('./knight');
var Queen = require('./queen');
var King = require('./king');
var Pawn = require('./pawn');
var Chip = require('./chip');
var playerType = require('./playerType');

class Board {
	constructor(parent) {
		this.width = 8;
		this.height = 8;
		this.fields = [];
		this.chips = [0,0,0,0];
		this.figures = [0,0];
		this.parentGame = parent;
		for(var x = 1; x <= this.height; x++) {
			this.fields[x] = [];
			for(var y = 1; y <= this.width; y++) {
				this.fields[x][y] = new Field(x,y);
			}
		}
		console.log('New Chessboard created!');
	}

	getField(x, y) {
		return this.fields[x][y];
	}

	beat(x, y, attacker) {
		var defender = this.fields[x][y].getFigure();
		if(defender == null) {
			return true;
		} else {
			return this.fields[x][y].getFigure().beat(attacker);
		}
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
					newFigure = new Chip(this, currentFigure.x, currentFigure.y, currentFigure.color);
					this.fields[currentFigure.x][currentFigure.y].setFigure(newFigure);
					this.chips[currentFigure.color]++;
					break;
				case 'ROOK': 
					newFigure = new Rook(this, currentFigure.x, currentFigure.y, currentFigure.color);
					this.fields[currentFigure.x][currentFigure.y].setFigure(newFigure);
					this.figures[currentFigure.color]++;
					break;
				case 'KNIGHT': 
					newFigure = new Knight(this, currentFigure.x, currentFigure.y, currentFigure.color);
					this.fields[currentFigure.x][currentFigure.y].setFigure(newFigure);
                    this.figures[currentFigure.color]++;
					break;
				case 'BISHOP': 
					newFigure = new Bishop(this, currentFigure.x, currentFigure.y, currentFigure.color);
					this.fields[currentFigure.x][currentFigure.y].setFigure(newFigure);
                    this.figures[currentFigure.color]++;
					break;
				case 'QUEEN': 
					newFigure = new Queen(this, currentFigure.x, currentFigure.y, currentFigure.color);
					this.fields[currentFigure.x][currentFigure.y].setFigure(newFigure);
                    this.figures[currentFigure.color]++;
					break;
				case 'KING': 
					newFigure = new King(this, currentFigure.x, currentFigure.y, currentFigure.color);
					this.fields[currentFigure.x][currentFigure.y].setFigure(newFigure);
                    this.figures[currentFigure.color]++;
					break;
				case 'PAWN': 
					newFigure = new Pawn(this, currentFigure.x, currentFigure.y, currentFigure.color);
					this.fields[currentFigure.x][currentFigure.y].setFigure(newFigure);
                    this.figures[currentFigure.color]++;
					break;
				default:
					console.log('Invalid Figure in Level Data!')
					break;
			}
		}
	}
	
}

module.exports = Board;