let lang,
    lvlType,
    PixiEngine = null,
    DisplayControl = null,
    GameControl = null,
    player = 0; 

let startGame = function() {
    if (GameControl.level === undefined) {
        toastr.info(strings[lang].toasts.lvl_still_loading);
        setTimeout(startGame, 1500);
    } else {
        if (lvlType === 'mp') {
            let mode = DisplayController.checkStartMpModeRadios();
            if (mode === undefined) {
                toastr.warning(strings[lang].toasts.no_mode_selected);
                return;
            } else {
                GameControl.connectLocalGame(lvlType, window.location.pathname.split('/')[4], mode, GameControl.joinIds, function(gameId) {
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
            toastr.info(strings[lang].toasts.lvl_still_loading);

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
            toastr.success(strings[lang].toasts.category_completed);
            window.setTimeout(function() {
                window.location = '/' + lang;
            }, 3000);
        } else {
            window.location = '/' + lang + '/' + GameControl.level.type + '/' + GameControl.level.subtype + '/' + nextLevelId;
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
            yielded = true;
            // NOBREAK ^^
        case "win":
            PixiEngine.clear();
            DisplayControl.finishGame(GameControl, msgObj, yielded);
            won = true;
            break;
        case "figure":
            PixiEngine.createFigure(msgObj.x, msgObj.y, PixiEngine.figureSize, msgObj.color, msgObj.figureType);
            break;
        case "error":
            switch(msgObj.message) {
                case "INVALID_TURN":
                    toastr.error(strings[lang].toasts.invalid_turn);
                    break;
                default:
                    toastr.error(strings[lang].toasts.error);
            }
            break;
        case "exit":
            if (!won) {
                toastr.info(strings[lang].toasts.opponent_quit);
                window.setTimeout(function() {
                    window.location = '/';
                }, 3000);
            }
    }
};


$('document').ready(function() {
    let pathSplit = window.location.pathname.split('/');
    lang = pathSplit[1]
    lvlType = pathSplit[2];

    DisplayControl = new DisplayController();
    if (lvlType === 'sp' || lvlType === 'mp')
        GameControl = new GameController(pathSplit[4], undefined);
    else if (lvlType === 'mini')
        GameControl = new GameController(pathSplit[3], undefined);
    else if (lvlType === 'global')
        GameControl = new GameController(undefined, pathSplit[3]);

    if (lvlType === 'sp')
        GameControl.connectLocalGame(lvlType, pathSplit[4], 'unbeatable', GameControl.joinIds);
    // mp-local connecting upon choice of mode
    else if (lvlType === 'mini')
        GameControl.connectLocalGame(lvlType, pathSplit[3], 'beatable', GameControl.joinIds);
    else if (lvlType === 'global') {
        GameControl.connectGlobalGame(window.location.href.split('=')[1]);
        DisplayController.hideLvlOption();
    }
});
