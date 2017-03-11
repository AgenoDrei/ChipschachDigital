var gameId,
    joinIds = [],
    lvl;

var PixiEngine = null;

var host = "localhost";     //TODO: make flag-settable s.t. e.g. --deploy deploys t agenodrei or such without losing localhost
var toggleSidebar = function() {
    var wrapper = $('#wrapper');
    wrapper.hasClass('toggled') ? wrapper.removeClass('toggled') : wrapper.addClass('toggled');
};

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

var nextLevelForward = function() {     // assumes ordered level_list of dbCall
    $.get('/api/v1/level', function(lvls) {
        let idx = lvls.findIndex(x => x._id==lvl._id);

        if (lvls[idx + 1] === undefined || lvls[idx + 1].type !== lvl.type || lvls[idx + 1].subtype !== lvl.subtype) {
            toastr.success('Du hast alle Level dieser Kategorie erfolgreich absolviert!');
            window.setTimeout(function() {
                window.location = '/';
            }, 3000);
        } else {
            var link = '/' + window.location.href.split('/')[3].toUpperCase() + '/' + lvls[idx + 1]._id; // _/type/id
            if (lvl.type === 'mp')
                link += '/' + window.location.href.split('/')[5];        // +/mode
            window.location = link;
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
            PixiEngine.moveFigure(msgObj.origX, msgObj.origY, msgObj.destX, msgObj.destY);
            break;
        case "win":
            $('#finishModal').show();
            break;
        case "error":
            toastr.error('MEEP Error!');
            break;
    }
};

$('document').ready(function() {
    var split = window.location.href.split('/');
    var type = split[3],
        levelId = split[4],
        mode = split[5] === undefined ? 'unbeatable' : split[5];

    $.post('/api/v1/game', {type: type, level: levelId, mode: mode, local: true}, function(res) {
        gameId = res.gameId;
        $.get('/api/v1/game/' + gameId, function(res) {
            joinIds.push(res.joinId);       // append first joinId
            $.get('/api/v1/game/' + gameId, function(res) {
                joinIds.push(res.joinId);       // append second joinId
                $.get('/api/v1/level/' + levelId, function (res) {
                    lvl = res;
                    comHandle.connect(host, "4001", handleMessage, gameId, joinIds[0]);
                });
            });
        });
    });
});
