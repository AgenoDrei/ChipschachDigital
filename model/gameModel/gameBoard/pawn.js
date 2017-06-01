var playerType = require('../../constants').playerType;
var helper = require('../../helper');
var Figure = require('./figure');

class Pawn extends Figure{
	constructor(parentBoard, x, y, player) {
		if(player != playerType.PLAYERONE && player != playerType.PLAYERTWO) {
			throw 'Illegal player type!';
		}
		super(parentBoard, x, y, player);
		this.firstMove = true;
	}

	checkRules(destX, destY) {
		if(this.player == playerType.PLAYERONE) {
			if(this.x != destX) { //Hit a figure
				if(Math.abs(this.x - destX) != 1 || (this.y - destY) != 1)
					return false;
				if(this.board.getField(destX, destY).getFigure() == null)
					return false;
			} else if((this.y - destY) <= 2 && this.x == destX) { //Move forward
				if (this.y - destY < 0) { //backwards?!
				    return false;
                }
				if(this.y - destY == 2) { //Two fields
					if(!this.firstMove)
						return false;
					if(this.board.getField(destX, destY).getFigure() != null || this.board.getField(destX, this.y - 1).getFigure() != null)
						return false;
				} else if(this.y - destY == 1) { //One Field
					if(this.board.getField(destX, destY).getFigure() != null)
						return false;
				}
			} else {
				return false;
			}
		} else if(this.player == playerType.PLAYERTWO) {
			if(this.x != destX) { //Hit a figure
				if(Math.abs(this.x - destX) != 1 || (this.y - destY) != -1)
					return false;
				if(this.board.getField(destX, destY).getFigure() == null)
					return false;
			} else if((destY - this.y) <= 2 && this.x == destX) { //Move forward
				if(destY - this.y == 2) { //Two fields
					if(!this.firstMove)
						return false;
					if(this.board.getField(destX, destY).getFigure() != null || this.board.getField(destX, this.y + 1).getFigure() != null)
						return false;
				} else if(destY - this.y == 1) { //One Field
					if(this.board.getField(destX, destY).getFigure() != null)
						return false;
				}
			} else {
				return false;
			}
		}
		return this.board.beat(destX, destY, this);
	}

	move(destX, destY) {
		this.firstMove = false;
		super.move(destX, destY);
	}
}

module.exports = Pawn;