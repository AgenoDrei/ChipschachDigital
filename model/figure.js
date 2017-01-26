var playerType = require('./playerType');
var helper = require('./helper');

class Figure {
	constructor(parentBoard, x, y, player) {
		this.board = parentBoard;
		this.x = x;
		this.y = y;
		this.player = player;

	}

	move(destX, destY){

	}

	beat(beater) {
		if(helper.enemy(beater.player, this.player)) {
			this.board.fields[this.x][this.y].setFigure(null);
			return true;
		}
		return false;
	}
}

module.exports = Figure;