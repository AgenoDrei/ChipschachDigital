let lvlType,
    PixiEngine = null,
    DisplayControl = null,
    GameControl = null;
let host = "localhost";     //TODO: make flag-settable s.t. e.g. --deploy deploys t agenodrei or such without losing localhost

let startGame = function() {
    if (GameControl.level === undefined) {
        toastr.info('Level muss noch geladen werden, noch einen kurzen Moment Geduld.');
        setTimeout(startGame, 1000);
    } else {
        if (lvlType === 'mp') {
            let mode = DisplayController.checkStartMpModeRadios();
            if (mode === undefined) {
                toastr.warning('Bitte einen Modus wählen.');
                return;
            } else {
                GameControl.connectLocalGame(lvlType, window.location.pathname.split('/')[3], mode, GameControl.joinIds, function(gameId) {
                    GameControl.gameId = gameId;
                })
            }
        }
        DisplayControl.startPixi(GameControl.level);
        DisplayControl.startGame();
    }
};

let yieldGame = function() {
    if(comHandle.ws == null)
        throw "Communication Handler not initialzied";
    comHandle.send({
        type: "yield",
        gameId: GameControl.gameId,
        joinId: GameControl.joinIds[PixiEngine.turn]
    });
};

let undo = function () {
    if(comHandle.ws == null)
        throw "Communication Handler not initialzied";
    comHandle.send(undoObj = {
        type: "undo",
        gameId: GameControl.gameId,
        joinId: GameControl.joinIds[PixiEngine.turn]
    });
};

let nextLevelForward = function() {     // assumes ordered level_list of dbCall
    let nextLevelId = GameControl.getSubsequentLevel(function(nextLevelId) {
        if (nextLevelId === undefined) {
            toastr.success('Du hast alle Level dieser Kategorie erfolgreich absolviert!');
            window.setTimeout(function() {
                window.location = '/';
            }, 3000);
        } else {
            let locHrefSplit = window.location.href.split('/');
            window.location = '/' + GameControl.level.type+ '/' + GameControl.level.subtype + '/' + nextLevelId;
        }
    });
};

let handleMoves = function(origX, origY, x, y) {
    comHandle.send({
        type: "turn",
        gameId: GameControl.gameId,
        joinId: GameControl.joinIds[0],
        origX: origX,
        origY: origY,
        destX: x,
        destY: y
    });
};

let handleMessage = function(msg) {
    let yielded = false,
        msgObj = JSON.parse(msg.data);
    console.log("Server> ", msgObj);

    switch(msgObj.type) {
        case "start":
            console.log('Game about to start!');
            startGame();
            break;
        case "turn":
            if (PixiEngine.turn === playerType.PLAYERONE) {
                DisplayControl.movesP1++;
                if (Helper.getFigure(msgObj.destX, msgObj.destY, PixiEngine.figures) !== null)
                    DisplayControl.chipsP1++;
                DisplayControl.updateCounters();
            } else if (PixiEngine.turn === playerType.PLAYERTWO) {
                DisplayControl.movesP2++;
                if (Helper.getFigure(msgObj.destX, msgObj.destY, PixiEngine.figures) !== null)
                    DisplayControl.chipsP2++;
                DisplayControl.updateCounters();
            }
            PixiEngine.moveFigure(msgObj.origX, msgObj.origY, msgObj.destX, msgObj.destY);
            break;
        case "undo":
            let safeSelection = new Selection(msgObj.destX, msgObj.destY);
            safeSelection.active = true;
            PixiEngine.selectionHandler.nextTurn(msgObj.player);
            PixiEngine.moveFigure(msgObj.origX, msgObj.origY, msgObj.destX, msgObj.destY);
            PixiEngine.selectionHandler.nextTurn(msgObj.player);
            PixiEngine.selectionHandler.selections[msgObj.player] = safeSelection;
            PixiEngine.selectionHandler.switchGraphic(false, safeSelection.x, safeSelection.y);
            break;
        case "yield":
            $('#winmsgYielded').show();
            $('#btnNext').hide();
            yielded = true;
            // NOBREAK ^^
        case "win":
            if (GameControl.level.type === "sp") {
                if (DisplayControl.movesP1 === GameControl.level.minturns) {
                    $('#winmsgMinturnsSuccess').show();
                    $('#btnRepeat').hide();
                }
                else
                    if (!yielded)
                        $('#winmsgMinturnsFailed').show();
            } else {
                if (msgObj.player === playerType.PLAYERONE)
                    $('#winmsgGenericYellow').show();
                else if (msgObj.player === playerType.PLAYERTWO)
                    $('#winmsgGenericBlue').show();
            }
            $('#finishModal').show();
            break;
        case "figure":
            PixiEngine.createFigure(msgObj.x, msgObj.y, PixiEngine.figureSize, msgObj.color, msgObj.figureType);
            break;
        case "error":
            switch(msgObj.message) {
                case "INVALID_TURN":
                    toastr.error('Dieser Zug ist nicht erlaubt.');
                    break;
                default:
                    toastr.error('Server error!');
            }
            break;
    }
};


$('document').ready(function() {
    let pathSplit = window.location.pathname.split('/');
    lvlType = pathSplit[1];

    if (lvlType !== 'global')
        GameControl = new GameController(pathSplit[3], undefined);
    else
        GameControl = new GameController(undefined, pathSplit[2]);
    DisplayControl = new DisplayController();

    if (lvlType === 'sp')
        GameControl.connectLocalGame(lvlType, pathSplit[3], 'unbeatable', GameControl.joinIds);
    // mp-local connecting upon choice of mode
    else if (lvlType === 'global')
        GameControl.connectGlobalGame(window.location.href.split('=')[1]);
});
