// var gameId,
//     joinIds = [];
// var lvl;
//     movesP1 = 0, movesP2 = 0,
//     chipsP1 = 0, chipsP2 = 0;
// var boardSize = 0;


var PixiEngine = null,
    DisplayControl = null,
    GameControl = null;
var host = "localhost";     //TODO: make flag-settable s.t. e.g. --deploy deploys t agenodrei or such without losing localhost


// var loadAndRegisterLocal = function(modeIdentifier, cb) {    // loading & registering local levels
//     let split = window.location.href.split('/');
//     let type = split[3].toUpperCase(),
//         // subtype = split[4],
//         levelId = split[5],
//         mode;
//     if ((modeIdentifier !== "beatable") && (modeIdentifier !== "unbeatable")) {
//          let radioValue = $("input[name='gameMode']:checked").val();
//          if (radioValue !== undefined)
//             mode = radioValue;
//          else {
//              toastr.warning('Bitte einen Modus wählen.');
//              return;
//          }
//     } else {
//         mode = modeIdentifier;
//     }
//
//     $.post('/api/v1/game', {type: type, level: levelId, mode: mode, local: true, name: ""}, function(res) {
//         gameId = res.gameId;
//         $.get('/api/v1/game/' + gameId, function(res) {
//             joinIds.push(res.joinId);       // append first joinId
//             $.get('/api/v1/game/' + gameId, function(res) {
//                 joinIds.push(res.joinId);       // append second joinId
//                 $.get('/api/v1/level/' + levelId, function (res) {
//                     lvl = res;
//                     comHandle.connect(host, "4001", handleMessage, gameId, joinIds[0]);
//                     if (cb !== undefined)
//                         cb();
//                 });
//             });
//         });
//     });
// };

// var loadAndRegisterGlobal = function(gameId) {
//     $.get('/api/v1/game/' + gameId, function(res) {     // register yourself
//         joinIds.push(res.joinId);       // joinIDs will only have length ONE in this case
//         $.get('/api/v1/game', function(res) {
//             res.forEach(function(globalGame) {
//                 if (globalGame.id === gameId) {
//                     $.get('/api/v1/level/' + globalGame.levelId, function (res) {
//                         lvl = res;
//                         comHandle.connect(host, "4001", handleMessage, gameId, joinIds[0]);
//                     });
//                 }
//             })
//         });
//     });
// };



var yieldGame = function() {
    if(comHandle.ws == null)
        throw "Communication Handler not initialzied";
    comHandle.send({
        type: "yield",
        gameId: GameControl.gameId,
        joinId: GameControl.joinIds[PixiEngine.turn]
    });
};

var undo = function () {
    if(comHandle.ws == null)
        throw "Communication Handler not initialzied";
    comHandle.send(undoObj = {
        type: "undo",
        gameId: GameControl.gameId,
        joinId: GameControl.joinIds[PixiEngine.turn]
    });
};


var nextLevelForward = function() {     // assumes ordered level_list of dbCall
    let nextLevelId = GameControl.getSubsequentLevel(function(nextLevelId) {
        if (nextLevelId === undefined) {
            toastr.success('Du hast alle Level dieser Kategorie erfolgreich absolviert!');
            window.setTimeout(function() {
                window.location = '/';
            }, 3000);
        } else {
            let locHrefSplit = window.location.href.split('/');
            window.location = '/' + GameControl.lvlType + '/' + GameControl.lvlSubtype + '/' + nextLevelId;
        }
    });
};

var handleMoves = function(origX, origY, x, y) {
    //console.log("Moved!!!");
    var moveObj = {
        type: "turn",
        gameId: gameId,
        joinId: joinIds[0],
        origX: origX,
        origY: origY,
        destX: x,
        destY: y
    };
    comHandle.send(moveObj);
}

var handleMessage = function(msg) {
    let yielded = false;
    var msgObj = JSON.parse(msg.data);
    console.log("Server> ", msgObj);

    switch(msgObj.type) {
        case "start":
            console.log('Game about to start!');
            DisplayControl.startPixi();
            DisplayControl.startGame();
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
            if (lvl.type === "sp") {
                if (DisplayControl.movesP1 === lvl.minturns) {
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
    DisplayControl = new DisplayController();
    GameControl = new GameController(window.location.pathname.split('/'));
});
