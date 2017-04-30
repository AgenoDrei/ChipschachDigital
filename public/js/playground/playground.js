let lvlType,
    PixiEngine = null,
    DisplayControl = null,
    GameControl = null,
    player = playerType.PLAYERONE;
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

        // start Pixi
        if (GameControl.level !== undefined) {
            let operationMode = GameControl.level.type === 'sp' ? gameType.SP : gameType.MP;
            PixiEngine = new GameEngine(DisplayControl.boardSize, DisplayControl.boardSize, operationMode, document.getElementById('board-anchor'), (lvlType=='global'?true:false));
            PixiEngine.setPlayer(player);
            PixiEngine.init(function () {
                PixiEngine.loadLevel(GameControl.level, function () {
                    PixiEngine.setMoveCallback(function(origX, origY, x, y) {
                        comHandle.send({
                            type: "turn",
                            gameId: GameControl.gameId,
                            joinId: GameControl.joinIds[0],
                            origX: origX,
                            origY: origY,
                            destX: x,
                            destY: y
                        });
                    });
                    PixiEngine.render();
                });
            });
        } else
            toastr.info('Level wird noch geladen, einen Moment Geduld noch ...');

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

let handleMessage = function(msg) {
    let yielded = false,
        won = false,
        msgObj = JSON.parse(msg.data);
    console.log("Server> ", msgObj);

    switch(msgObj.type) {
        case "hello":
            player = msgObj.player;
            break;
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
            if (lvlType !== 'sp')
            DisplayController.switchTurnIndication();
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
            DisplayControl.finishGame(GameControl, msgObj, yielded);
            won = true;
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
        case "exit":
            if (!won) {
                toastr.info("Dein Gegner hat das Spiel scheinbar verlassen ...");
                window.setTimeout(function() {
                    window.location = '/';
                }, 3000);
            }
    }
};


$('document').ready(function() {
    let pathSplit = window.location.pathname.split('/');
    lvlType = pathSplit[1];

    DisplayControl = new DisplayController();
    if (lvlType !== 'global')
        GameControl = new GameController(pathSplit[3], undefined);
    else
        GameControl = new GameController(undefined, pathSplit[2]);

    if (lvlType === 'sp')
        GameControl.connectLocalGame(lvlType, pathSplit[3], 'unbeatable', GameControl.joinIds);
    // mp-local connecting upon choice of mode
    else if (lvlType === 'global') {
        GameControl.connectGlobalGame(window.location.href.split('=')[1]);
        DisplayController.hideLvlOption();
    }
});
