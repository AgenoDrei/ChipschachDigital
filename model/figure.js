var playerType = require('./playerType');
var helper = require('./helper');

class Figure {
	constructor(parentBoard, x, y, player) {
		this.board = parentBoard;
		this.x = x;
		this.y = y;
		this.player = player;

	}

	move(destX, destY) {
		this.board.getField(this.x,this.y).setFigure(null);
		this.x = destX;
		this.y = destY;
		this.board.getField(this.x,this.y).setFigure(this);
	}		

	beat(beater) {
		if(helper.enemy(beater.player, this.player)) {
			this.board.fields[this.x][this.y].setFigure(null);
			this.board.parentGame.win.captureFigure(this.player, this.constructor.name);
			return true;
		}
		return false;
	}
}

module.exports = Figure;