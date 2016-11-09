var playerType = require('./playerType');
var Figure = require('./figure');
var helper = require('./helper');

class Pawn extends Figure{
	constructor(parentBoard, x, y, player) {
		if(player != playerType.PLAYERONE || player != playerType.PLAYERTWO) {
			throw 'Illegal player type!';
		}
		this.firstMove = true;
		super(parentBoard, x, y, chipType);
	}

	move(destX, destY) {
		return false;
	}
}

module.exports = Pawn;