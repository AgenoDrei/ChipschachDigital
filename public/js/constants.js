var gameState = {
    UNKNOWN: -99,
    PLAYER_DISCONNECTED: -3,
    INVALID_TURN: -2,
    INVALID_TURN_CHECK: -1,
    VALID_TURN: 0,
    WIN_PLAYER1: 1,
    WIN_PLAYER2: 2,
    WIN_DRAW: 3
};

var gameType = {
    SP: 0,
    MP: 1,
    MINI: 2
};

var playerType = {
    PLAYERONE: 0,
    PLAYERTWO: 1,
    BOTH: 2,
    NONE: 3
};

var figureSize = null;

var winner = {  // dirty solution kinda because of: missmatch between gameState.WIN_PLAYER1 (1) and playerType.PLAYERONE (0) ...
    PLAYERONE: 1,
    PLAYERTWO: 2,
    DRAW: 3
};
