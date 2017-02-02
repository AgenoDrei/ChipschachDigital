var playerType = require('./playerType');
var Figure = require('./figure');
var helper = require('./helper');

class Bishop extends Figure{
	constructor(parentBoard, x, y, player) {
		if(player != playerType.PLAYERONE && player != playerType.PLAYERTWO) {
			throw 'Illegal player type!';
		}
		super(parentBoard, x, y, player);
	}

	checkRules(destX, destY) {
		return false;
	}

	move(destX, destY) {
		this.board.getField(this.x,this.y).setFigure(null);
		this.x = destX;
		this.y = destY;
		this.board.getField(this.x,this.y).setFigure(this);
	}		
}

module.exports = Bishop;