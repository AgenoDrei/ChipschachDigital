var playerType = require('../../constants').playerType;
var helper = require('../../helper');
var Figure = require('./figure');

class Bishop extends Figure{
	constructor(parentBoard, x, y, player) {
		if(player != playerType.PLAYERONE && player != playerType.PLAYERTWO) {
			throw 'Illegal player type!';
		}
		super(parentBoard, x, y, player);
	}

	checkRules(destX, destY) {
		if (Math.abs(this.x - destX) != Math.abs(this.y - destY)) {
			return false;
		}

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

			return this.board.beat(destX, destY, this);
		
	}
}

module.exports = Bishop;