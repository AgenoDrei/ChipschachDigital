var playerType = require('./constants').playerType;
var Figure = require('./figure');
var helper = require('./helper');

class Knight extends Figure{
	constructor(parentBoard, x, y, player) {
		if(player != playerType.PLAYERONE && player != playerType.PLAYERTWO) {
			throw 'Illegal player type!';
		}
		super(parentBoard, x, y, player);
	}

	checkRules(destX, destY) {
		if (((Math.abs(destX - this.x) == 2) && (Math.abs(destY - this.y) == 1)) || ((Math.abs(destY - this.y) == 2) && (Math.abs(destX - this.x) == 1)))
			return this.board.beat(destX, destY, this);
	}

}

module.exports = Knight;