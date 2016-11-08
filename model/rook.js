var figureType = require('./figureType');
var Figure = require('./figure');
var helper = require('./helper');

class Rook extends Figure{
	constructor(parentBoard, x, y, player) {
		if(player != figureType.PLAYERONE && player != figureType.PLAYERTWO) {
			throw 'Illegal player type!';
		}
		super(parentBoard, x, y, player);
	}

	move(destX, destY) {
		if (this.x != destX && this.y != destY)
			return false;

		if (this.y == destY) {
			if (this.x > destX) {
				for (var i = this.x - 1; i >= destX; i--) {
					if (this.board.getField(i, this.y) != null)
						return false;
				}
			} else if (destX > this.x) {
				for (var i = this.x + 1; i <= destX; i++) {
					if (this.board.getField(i, this.y) != null)
						return false;
				}

			}
		} else if (this.x == destX) {
			if (this.y > destY) {
				for (var i = this.y - 1; i >= destY; i--) {
					if (this.board.getField(this.x, i) != null)
						return false;
				}
			} else if (destY > this.y) {
				for (var i = this.y + 1; i <= destX; i++) {
					if (this.board.getField(this.x, i) != null)
						return false;
				}
			}
		}
		return this.board.beat(destX, destY, this);
	}
}

module.exports = Rook;