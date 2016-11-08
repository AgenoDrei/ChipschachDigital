var figureType = require('./figureType');
var figure = require('./figure');
var helper = require('./helper');

class Pawn extends Figure{
	constructor(parentBoard, x, y, player) {
		if(player != figureType.PLAYERONE || player != figureType.PLAYERTWO) {
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