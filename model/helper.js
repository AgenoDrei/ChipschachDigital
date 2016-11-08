var figureType = require('./figureType');

module.exports.enemy = function(attacker, defender) {
	if(attacker == defender) {
		return false;
	} else if(attacker == figureType.NONE) {
		return true; //TODO: Check for validity
	}
	return true;
}