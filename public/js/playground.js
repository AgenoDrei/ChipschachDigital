var gameId,
    joinIds = [];
var lvl,
    movesP1 = 0, movesP2 = 0,
    chipsP1 = 0, chipsP2 = 0;

var PixiEngine = null;

var host = "localhost";     //TODO: make flag-settable s.t. e.g. --deploy deploys t agenodrei or such without losing localhost
var toggleSidebar = function() {
    var wrapper = $('#wrapper');
    wrapper.hasClass('toggled') ? wrapper.removeClass('toggled') : wrapper.addClass('toggled');
};

var loadAndRegister = function(modeIdentifier, cb) {
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

    $.post('/api/v1/game', {type: type, level: levelId, mode: mode, local: true}, function(res) {
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
}

var startGame = function() {
    if (lvl !== undefined) {
        $('#startModal').removeClass('show');
        var operationMode;
        if (lvl.type === 'sp')
            operationMode = gameType.SP;
        if (lvl.type === 'mp' || lvl.type === 'mini')
            operationMode = gameType.MP;

        PixiEngine = new GameEngine(560, 560, operationMode, document.getElementById('board-anchor'));

        $('#board-layer-behind').css({
            'width': '640',
            'height': '640',
            'padding': '40',
            'background-image': 'url(/img/board_named.png)'
        });
        PixiEngine.init(function() {
            PixiEngine.loadLevel(lvl, function() {
                PixiEngine.setMoveCallback(handleMoves);
                PixiEngine.render();
            });
        });
    } else      // if hitting start just fast enough lvl is not loaded already
        toastr.info('Level wird noch geladen, einen Moment Geduld noch ...');
};

var yieldGame = function() {
    $('#yieldedModal').show();
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
    console.log("Moved!!!");
    var moveObj = {
        type: "turn",
        gameId: gameId,
        joinId: joinIds[0],
        origX: origX,
        origY: origY,
        destX: x,
        destY: y
    };
    console.log("Client> ", moveObj);
    comHandle.send(moveObj);
}

var handleMessage = function(msg) {
    var msgObj = JSON.parse(msg.data);
    console.log("Server> ", msgObj);

    switch(msgObj.type) {
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
        case "win":
            $('#finishModal').show();
            break;
        case "error":
            switch(msgObj.message) {
                case "INVALID_TURN":
                    toastr.error('Dieser Zug ist nicht erlaubt.');
                    break;
                default:
                    toastr.error('MEEP Error!');
            }
            break;
    }
};

$('document').ready(function() {
    $('[data-toggle="tooltip"]').tooltip();     // enable Bootstrap tooltips

    $('#moveCounterP1').val(movesP1);
    $('#moveCounterP2').val(movesP2);
    $('#chipCounterP1').val(chipsP1);
    $('#chipCounterP2').val(chipsP2);

    if (window.location.href.split('/')[3] === 'sp')
        loadAndRegister('unbeatable', undefined);
});
