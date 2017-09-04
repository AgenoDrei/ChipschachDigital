let lang = "",
    DisplayControl = null,
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
    
    if (lvl.name === '' 
        || lvl.description === '' 
        || lvl.board.length === 0 
        || (lvl.type === 'sp' && isNaN(lvl.minturns))) {
        toastr.info(strings[lang].toasts.editor_no_valid_config);
        console.log('Rejected Lvl:', lvl);
    } else if ((lvl.contact !== undefined) && !document.getElementById('contact18').checked) { 
        toastr.info(strings[lang].toasts.editor_no_18);
    } else {
        toastr.success(strings[lang].toasts.editor_valid_lvl);
        console.log('Posting lvl:', lvl);
        // $.post('/editor', {level: JSON.stringify(lvl)});
    }
};

$(document).ready(function() {
    lang = window.location.pathname.split('/')[1];
    DisplayControl = new DisplayController();
});