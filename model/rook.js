var figureType = require('./figureType');
var figure = require('./figure');
var helper = require('./helper');

class Rook extends Figure{
	constructor(parentBoard, x, y, player) {
		if(player != figureType.PLAYERONE || player != figureType.PLAYERTWO) {
			throw 'Illegal player type!';
		}
		super(parentBoard, x, y, chipType);
	}

	move(destX, destY) {
	}
}

module.exports = Rook;