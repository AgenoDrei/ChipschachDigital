var figureType = require('./figureType');

module.exports.enemy = function(player1, player2) {
	if(player1 == player2) {
		return false;
	} else if(player1 == figureType.NONE || player2 == figureType.NONE) {
		return false;
	}
	return true;
}