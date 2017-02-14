var playerType = require('./playerType');

module.exports.enemy = function(attacker, defender) {
	if(attacker == defender) {
		return false;
	} else if(defender == playerType.NONE || attacker == playerType.NONE) {
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

module.exports.determinePlayer = function(connection, joinId, player1, player2) {
	if(joinId) {
		if(player1.joinId == joinId)
			return playerType.PLAYERONE;
		else if(player2.joinId == joinId)
			return playerType.PLAYERTWO;
		else
			return playerType.NONE;
	} else {
		if(player1.connection == connection)
			return playerType.PLAYERONE;
		else if(player2.connection == connection)
			return playerType.PLAYERTWO;
		else
			return playerType.NONE;
	}
};

module.exports.enumToString = function(enumObj, value)  {
  for (var k in enumObj) if (enumObj[k] == value) return k;
  return null;
};