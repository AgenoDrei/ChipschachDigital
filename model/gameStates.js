var gameStates = {
	UNKNOWN: -99,
	PLAYER_DISCONNECTED: -3,
	INVALID_TURN: -2,
	INVALID_TURN_CHECK: -1,
	VALID_TURN: 0,
	WIN_PLAYER1: 1,
	WIN_PLAYER2: 2,
	WIN_DRAW: 3
};

module.exports = gameStates;