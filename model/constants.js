module.exports = {

	connectionState: {
		EMPTY: 0,
		JOINED: 1,
		CONNECTED: 2,
		LEFT: 3
	},

	gameState: {
		UNKNOWN: -99,
		PLAYER_DISCONNECTED: -3,
		INVALID_TURN: -2,
		INVALID_TURN_CHECK: -1,
		VALID_TURN: 0,
		WIN_PLAYER1: 1,
		WIN_PLAYER2: 2,
		WIN_DRAW: 3
	},

	gameType: {
		SP: 0,
		MP: 1,
		MINI: 2
	},

	playerType: {
		PLAYERONE: 0,
		PLAYERTWO: 1,
		BOTH: 2,
		NONE: 3
	},

	figureType: {
		CHIP: 0,
		PAWN: 1,
		KNIGHT: 2,
		BISHOP: 3,
		ROOK: 4,
		QUEEN: 5,
		KING: 6
	},

	winCondition: {
	    PAWN_TO_LAST_ROW: 2,
	    FIG_REACHES_FIELD: 3
	},

	reviewStatus: {
		UNTESTED: -1,
    	FRESH: 0,
    	REVIEWED: 1,
    	OFFICIAL: 2
	},

	figureSize: null
};