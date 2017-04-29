let DisplayControl = null,
    PixiEngine = null;

let startEditor = function() {
    // start Pixi
    PixiEngine = new EditorEngine(DisplayControl.boardSize, document.getElementById('board-anchor'));
    PixiEngine.init(function () {
        PixiEngine.loadLevel(function() {
            PixiEngine.render();
        });
    });

    DisplayController.startGame();
};

let select = function(color, type, picSrc) {
    PixiEngine.selection = {
        type: type,
        color: color
    };
    DisplayController.setSelectionWindow(picSrc);
};
let clearSelection = function() {
    PixiEngine.selection = null;
    DisplayController.clearSelection();
}

$(document).ready(function() {
    DisplayControl = new DisplayController();
});