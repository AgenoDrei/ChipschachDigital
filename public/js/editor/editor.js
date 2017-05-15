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
};

let saveLvl = function() {
    // toastr.info('Automatisches Speichern und einpflegen von Leveln ist aufgrund von Diskusionsbedarf noch nicht implementiert.');
    let level = DisplayController.getLevelAttributes();
    level.board = PixiEngine.board;
    console.log(level);
};

$(document).ready(function() {
    DisplayControl = new DisplayController();
});