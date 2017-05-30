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

	winCondition: {
	    CHIPS: 0,
	    FIGURES: 1,
	    PAWN_TO_LAST_ROW: 2
	    // FIG_TO_CENTER: 3
	},

	reviewStatus: {
    	FRESH: 0,
    	REVIEWED: 1,
    	OFFICIAL: 2
	},

	figureSize: null
};