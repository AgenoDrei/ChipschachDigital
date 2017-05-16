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
    let lvl = DisplayController.getLevelAttributes();
    lvl.board = PixiEngine.board;
    
    if (lvl.name === '' || lvl.description === '' || lvl.board.length === 0 || (lvl.type === 'sp' && isNaN(lvl.minturns))) {
        toastr.info('Einige Attribute des Levels wurden nicht korrekt ausgefüllt oder das Level ist leer.');
        console.log('Rejected Lvl:', lvl);
    } else {
        toastr.success('Level wird erstellt!');
        console.log('Posting lvl:', lvl);
        $.post('/editor', {level: JSON.stringify(lvl)});
    }
};

$(document).ready(function() {
    DisplayControl = new DisplayController();
});