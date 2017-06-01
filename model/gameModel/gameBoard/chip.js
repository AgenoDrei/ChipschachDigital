var playerType = require('../../constants').playerType;
var helper = require('../../helper');
var Figure = require('./figure');

class Chip extends Figure{
	constructor(parentBoard, x, y, chipType) {
		super(parentBoard, x, y, chipType);
	}

	move(destX, destY) {
		console.log('You cannot move a Chip!');
		return false;
	}

	beat(beater) {
		if(helper.enemy(beater.player, this.player)) {
            this.board.parentGame.history.setLastBeat(this.board.fields[this.x][this.y].getFigure());
            this.board.fields[this.x][this.y].setFigure(null);
			this.board.parentGame.win.captureChip(beater.player, this.player);
			return true;
		}
		return false;
	}
}

module.exports = Chip;