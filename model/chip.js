var figureType = require('./figureType');
var figure = require('./figure');
var helper = require('./helper');

class Chip extends Figure{
	constructor(parentBoard, x, y, chipType) {
		super(parentBoard, x, y, chipType);
	}

	move(destX, destY) {
		console.log('You cannot move a Chip!');
		return false;
	}

	beat(beater) {
		if(helper.enemy(beater.player) == this.player) {
			
		}
	}
}

module.exports = Chip;