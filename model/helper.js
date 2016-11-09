var playerType = require('./playerType');

module.exports.enemy = function(attacker, defender) {
	if(attacker == defender) {
		return false;
	} else if(attacker == playerType.NONE) {
		return false; //TODO: Check for validity
	}
	return true;
};

module.exports.getEnemy = function(player) {
	if(player == playerType.PLAYERONE) {
		return playerType.PLAYERTWO;
	} else if(player == playerType.PLAYERTWO) {
		return playerType.PLAYERONE;
	}
};

module.exports.enumToString = function(enum,value)  {
  for (var k in enum) if (enum[k] == value) return k;
  return null;
};