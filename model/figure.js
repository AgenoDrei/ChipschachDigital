var playerType = require('./constants').playerType;
var helper = require('./helper');

class Figure {
	constructor(parentBoard, x, y, player) {
		this.board = parentBoard;
		this.x = x;
		this.y = y;
		this.player = player;

	}

	move(destX, destY) {
		this.board.parentGame.history.setLastMove(destX, destY, this);
		this.board.getField(this.x,this.y).setFigure(null);
		this.x = destX;
		this.y = destY;
		this.board.getField(this.x,this.y).setFigure(this);
	}		

	beat(beater) {
		if(this.board.parentGame.mode == 'unbeatable')
			return false;

		if(helper.enemy(beater.player, this.player)) {
            this.board.parentGame.history.setLastBeat(this.board.fields[this.x][this.y].getFigure());
			this.board.fields[this.x][this.y].setFigure(null);
			this.board.parentGame.win.captureFigure(this.player, this.constructor.name);
			return true;
		}
		return false;
	}
}

module.exports = Figure;