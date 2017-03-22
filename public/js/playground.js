var gameId,
    joinIds = [];
var lvl,
    movesP1 = 0, movesP2 = 0,
    chipsP1 = 0, chipsP2 = 0;
var boardSize = 0;
// const BOARDLAYERPADDING = 40;
// const BOARDSIZERATIO = 0.9;

var PixiEngine = null;
var host = "localhost";     //TODO: make flag-settable s.t. e.g. --deploy deploys t agenodrei or such without losing localhost


var loadAndRegisterLocal = function(modeIdentifier, cb) {    // loading & registering local levels
    let split = window.location.href.split('/');
    let type = split[3].toUpperCase(),
        // subtype = split[4],
        levelId = split[5],
        mode;
    if ((modeIdentifier !== "beatable") && (modeIdentifier !== "unbeatable")) {
         let radioValue = $("input[name='gameMode']:checked").val();
         if (radioValue !== undefined)
            mode = radioValue;
         else {
             toastr.warning('Bitte einen Modus wählen.');
             return;
         }
    } else {
        mode = modeIdentifier;
    }

    $.post('/api/v1/game', {type: type, level: levelId, mode: mode, local: true, name: ""}, function(res) {
        gameId = res.gameId;
        $.get('/api/v1/game/' + gameId, function(res) {
            joinIds.push(res.joinId);       // append first joinId
            $.get('/api/v1/game/' + gameId, function(res) {
                joinIds.push(res.joinId);       // append second joinId
                $.get('/api/v1/level/' + levelId, function (res) {
                    lvl = res;
                    comHandle.connect(host, "4001", handleMessage, gameId, joinIds[0]);
                    if (cb !== undefined)
                        cb();
                });
            });
        });
    });
};

var loadAndRegisterGlobal = function() {
    $.get('/api/v1/game/' + gameId, function(res) {     // register yourself
        joinIds.push(res.joinId);       // joinIDs will only have length ONE in this case
        $.get('/api/v1/game', function(res) {
            res.forEach(function(globalGame) {
                if (globalGame.id === gameId) {
                    $.get('/api/v1/level/' + globalGame.levelId, function (res) {
                        lvl = res;
                        comHandle.connect(host, "4001", handleMessage, gameId, joinIds[0]);
                    });
                }
            })
        });
    });
};

var startGame = function() {
    if (lvl !== undefined) {
        $('#startModal').hide();
        var operationMode;
        if (lvl.type === 'sp')
            operationMode = gameType.SP;
        if (lvl.type === 'mp' || lvl.type === 'mini')
            operationMode = gameType.MP;

        PixiEngine = new GameEngine(boardSize, boardSize, operationMode, document.getElementById('board-anchor'));
        PixiEngine.init(function() {
            PixiEngine.loadLevel(lvl, function() {
                PixiEngine.setMoveCallback(handleMoves);
                PixiEngine.render();
            });
        });

        // adjustCss();
    } else      // if hitting start just fast enough lvl is not loaded already
        toastr.info('Level wird noch geladen, einen Moment Geduld noch ...');
};

var yieldGame = function() {
    if(comHandle.ws == null)
        throw "Communication Handler not initialzied";
    var yieldObj = {
        type: "yield",
        gameId: gameId,
        joinId: joinIds[PixiEngine.turn]
    };
    comHandle.send(yieldObj);
};

var undo = function () {
    if(comHandle.ws == null)
        throw "Communication Handler not initialzied";
    var undoObj = {
        type: "undo",
        gameId: gameId,
        joinId: joinIds[PixiEngine.turn]
    };
    comHandle.send(undoObj);
};


var nextLevelForward = function() {     // assumes ordered level_list of dbCall
    $.get('/api/v1/level', function(lvls) {
        let idx = lvls.findIndex(x => x._id==lvl._id);

        if (lvls[idx + 1] === undefined || lvls[idx + 1].type !== lvl.type || lvls[idx + 1].subtype !== lvl.subtype) {
            toastr.success('Du hast alle Level dieser Kategorie erfolgreich absolviert!');
            window.setTimeout(function() {
                window.location = '/';
            }, 3000);
        } else {
            let locHrefSplit = window.location.href.split('/');
            window.location = '/' + locHrefSplit[3] + '/' + locHrefSplit[4] + '/' + lvls[idx + 1]._id; // _/type/id
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
            startGame();
            break;
        case "turn":
            if (PixiEngine.turn === playerType.PLAYERONE) {
                movesP1++;
                if (Helper.getFigure(msgObj.destX, msgObj.destY, PixiEngine.figures) !== null)
                    chipsP1++;
                $('#moveCounterP1').val(movesP1);
                $('#chipCounterP1').val(chipsP1);
            } else if (PixiEngine.turn === playerType.PLAYERTWO) {
                movesP2++;
                if (Helper.getFigure(msgObj.destX, msgObj.destY, PixiEngine.figures) !== null)
                    chipsP2++;
                $('#moveCounterP2').val(movesP2);
                $('#chipCounterP2').val(chipsP2);
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
                if (movesP1 === lvl.minturns) {
                    $('#winmsgMinturnsSuccess').show();
                    $('#btnRepeat').hide();
                }
                else
                    if (!yielded)
                        $('#winmsgMinturnsFailed').show();
            } else {
                if (msgObj.player === gameState.WIN_PLAYER1)
                    $('#winmsgGenericYellow').show();
                else if (msgObj.player === gameState.WIN_PLAYER2)
                    $('#winmsgGenericBlue').show();
                else if (msgObj.player === gameState.WIN_DRAW)
                    $('#winmsgGenericDraw').show();

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

/* Styling */
var toggleClick = function(e) {
    if($('#nav').css("left") == "-250px") {
        $('#overlay').fadeIn(200);
        $('#nav').animate({left: "0px"}, 200);
        $('#btn_menu').css("background", "url('/img/close_menu.png') no-repeat scroll center center / 75% 75% #FFF");
    } else {
        $('#overlay').fadeOut(200);
        $('#nav').animate({left: "-250px"}, 200);
        $('#btn_menu').css("background", "url('/img/menu.png') no-repeat scroll center center / 80% 80% #FFF");
    }
};
function adjustScreen() {
    if(window.mobilecheck() || (window.innerWidth <= 900 && $('#nav').css("left") == "0px")){
        $('#nav').css("left", "-250px");
        $('#board-container').css("left", "0px");
        $('#btn_menu').show();
    } else if (window.innerWidth > 900 && $('#nav').css("left") == "-250px") {
        $('#nav').css("left", "0px");
        $('#board-container').css("left", "250px");
        $('#btn_menu').hide();
    }
}


window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
window.onresize = function() {
    adjustScreen();
}
$('document').ready(function() {
    $('[data-toggle="tooltip"]').tooltip();     // enable Bootstrap tooltips
    boardSize = $('#board-anchor').width();
    adjustScreen();

    $('#winmsgGenericYellow').hide();
    $('#winmsgGenericBlue').hide();
    $('#winmsgGenericDraw').hide();
    $('#winmsgMinturnsSuccess').hide();
    $('#winmsgMinturnsFailed').hide();
    $('#winmsgYielded').hide();
    $('#moveCounterP1').val(movesP1);
    $('#moveCounterP2').val(movesP2);
    $('#chipCounterP1').val(chipsP1);
    $('#chipCounterP2').val(chipsP2);

    $('#startModal').show();
    let split = window.location.href.split('/');
    if (split[3] === 'sp') {
        loadAndRegisterLocal('unbeatable', undefined);
    } else if (split[3] === 'global') {
        gameId = split[4];
        loadAndRegisterGlobal();
    }
});
