var playerType = require('./playerType');
var Figure = require('./figure');
var helper = require('./helper');

class King extends Figure{
	constructor(parentBoard, x, y, player) {
		if(player != playerType.PLAYERONE && player != playerType.PLAYERTWO) {
			throw 'Illegal player type!';
		}
		super(parentBoard, x, y, player);
	}

	checkRules(destX, destY) {
		if ((Math.abs(this.x - destX) > 1) || (Math.abs(this.y - destY) > 1)) {
			return false;
		}
		
		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1; j++) {
				debugger;
				if(destX + i == this.x && destY + j == this.y) {
					continue;
				}
				if (this.board.getField(destX + i, destY + j).getFigure() != null) { //Check for not empty field
					 if(this.board.getField(destX + i, destY + j).getFigure().constructor.name == 'King') { //Check for other King
					 	return false;
					 }
					 /*if(this.board.getFigure(destX + i, destY + j).getFigure().player != this.board.getFigure(this.x, this.y).player) {
						return false;
					}*/
				}
			}	
		}
		return this.board.beat(destX, destY, this);
	}
}

module.exports = King;