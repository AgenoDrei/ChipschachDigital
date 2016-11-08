var figureType = require('./figureType');
var Figure = require('./figure');
var helper = require('./helper');

class Chip extends Figure{
	constructor(parentBoard, x, y, chipType) {
		super(parentBoard, x, y, chipType);
	}

	move(destX, destY) {
		console.log('You cannot move a Chip!');
		return false;
	}
}

module.exports = Chip;