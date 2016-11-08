var figureType = require('./figureType');

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
		if(helper.enemy(beater.player, player)) {
			this.board[this.x][this.y] = null;
			return true;
		}
		return false;
	}
}

module.exports = Figure;