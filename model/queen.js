var playerType = require('./playerType');
var Figure = require('./figure');
var helper = require('./helper');

class Queen extends Figure{
	constructor(parentBoard, x, y, player) {
		if(player != playerType.PLAYERONE && player != playerType.PLAYERTWO) {
			throw 'Illegal player type!';
		}
		super(parentBoard, x, y, player);
	}

	checkRules(destX, destY) {
		// wenn wie der Läufer gelaufen:
		if (Math.abs(this.x - destX) == Math.abs(this.y - destY)) {
			if ((this.x - destX < 0) && (this.y - destY > 0)) { // zieht nach RechtsOben
				for (var i = 1; i < Math.abs(this.x - destX); i++) {
					if (this.board.getField(this.x + i, this.y - i).getFigure() != null)
						return false;
				}
			} else if ((this.x - destX < 0) && (this.y - destY < 0)) { // zieht nach
				// RechtsUnten
				for (var i = 1; i < Math.abs(this.x - destX); i++) {
					if (this.board.getField(this.x + i, this.y + i).getFigure() != null)
						return false;
				}
			} else if ((this.x - destX > 0) && (this.y - destY < 0)) { // zieht nach
				// LinksUnten
				for (var i = 1; i < Math.abs(this.x - destX); i++) {
					if (this.board.getField(this.x - i, this.y + i).getFigure() != null)
						return false;
				}
			} else if ((this.x - destX > 0) && (this.y - destY > 0)) { // zieht nach
				// RechtsOben
				for (var i = 1; i < Math.abs(this.x - destX); i++) {
					if (this.board.getField(this.x - i, this.y - i).getFigure() != null)
						return false;
				}
			}

		} else if (this.y == destY || this.x == destX) {
			// wenn wie der Turm gezogen:
			if (this.y == destY) {
				if (this.x > destX) {
					for (var i = this.x - 1; i > destX; i--) {
						if (this.board.getField(i, this.y).getFigure() != null)
							return false;
					}
				} else if (destX > this.x) {
					for (var i = this.x + 1; i < destX; i++) {
						if (this.board.getField(i, this.y).getFigure() != null)
							return false;
					}
				}

			} else if (this.x == destX) {
				if (this.y > destY) {
					for (var i = this.y - 1; i > destY; i--) {
						if (this.board.getField(this.x, i).getFigure() != null)
							return false;
					}
				} else if (destY > this.y) {
					for (var i = this.y + 1; i < destY; i++) {
						if (this.board.getField(this.x, i).getFigure() != null)
							return false;
					}
				}
			}
		} else {
			return false;
		}

		return this.board.beat(destX, destY, this);
	}

}

module.exports = Queen;