let DisplayControl = null,
    PixiEngine = null,
    level = null;

let startEditor = function() {
    // start Pixi
    PixiEngine = new GameEngine(DisplayControl.boardSize, DisplayControl.boardSize, gameType.SP, document.getElementById('board-anchor'), false);
    PixiEngine.init(function () {
        PixiEngine.loadLevel(level, function () {
            PixiEngine.render();
        });
    });

    DisplayController.startGame();
};

$(document).ready(function() {
    DisplayControl = new DisplayController();

    level = {
        id: '',
        name: '',
        description: '',
        board: [],
        type: '',
        subtype: '',
        minturns: 0
    };
});