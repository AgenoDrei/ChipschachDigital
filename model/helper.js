var figureType = require('./figureType');

module.exports.enemy = function(player) {
	if(player == figureType.PLAYERONE) {
		return figureType.PLAYERTWO;
	} else if(player == figureType.PLAYERTWO) {
		return figureType.PLAYERONE;
	return null;
}