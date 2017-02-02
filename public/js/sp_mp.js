var gameID, joinID, lvl;
var comHandle = {
    ws: null,

    connect: function(url, port, messageCallback) {
        if (window.WebSocket) {
            ws = new WebSocket('ws://' + url + ':' + port, 'kekse');
            ws.onopen = function() {
                var conObj = {
                    type: 'hello',
                    gameId: gameID,
                    joinId: joinID
                };
                console.log("Client> ", conObj);
                ws.send(JSON.stringify(conObj));
            };

            ws.onmessage = messageCallback;
            return ws;
        } else {
            console.error('Dieser Browser ist nicht aktuell genug (kein Websocket Support).');
            return null;
        }
    },

    send: function(message) {
        ws.send(message);
    }
};


var toggleSidebar = function() {
    $('#wrapper').hasClass('toggled') ? $('#wrapper').removeClass('toggled') : $('#wrapper').addClass('toggled');
};

var startGame = function() {
    if (lvl !== undefined) {
        $('#startModal').removeClass('show');
        if (lvl.type === 'sp')
            var operationMode = opMode.SP;
        if (lvl.type === 'mp' || lvl.type === 'mini')
            var operationMode = opMode.MP

        PixiEngine.destroy();
        PixiEngine.init(600, 600, operationMode, document.getElementById('board-anchor'), function() {
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

        if (lvls[idx + 1].type !== lvl.type || lvls[idx + 1].subtype !== lvl.subtype || lvls[idx + 1] === undefined) {
            toastr.success('Du hast alle Level dieser Kategorie erfolgreich absolviert!');
            window.setTimeout(function() {
                window.location = '/';
            }, 3000);
        } else {
            let link = '/' + window.location.href.split('/')[3].toUpperCase() + '/' + lvls[idx + 1]._id; // _/type/id
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
        gameId: gameID,
        origX: origX,
        origY: origY,
        destX: x,
        destY: y
    };
    console.log("Client> ", moveObj);
    comHandle.send(JSON.stringify(moveObj));
}

var handleMessage = function(msg) {
    var msgObj = JSON.parse(msg.data);
    console.log("Server> ", msgObj);

    switch(msgObj.type) {
        case "turn":
            PixiEngine.moveFigure(msgObj.origX, msgObj.origY, msgObj.destX, msgObj.destY);
            break;
        case "error":
            toastr.error('MEEP Error!');
            break;
    }
};

$('document').ready(function() {
    let split = window.location.href.split('/');
    let type = split[3],
        levelId = split[4],
        mode = split[5] === undefined ? 'unbeatable' : split[5];

    $.post('/api/v1/game', {type: type, level: levelId, mode: mode}, function(res) {
        gameID = res.gameId;
        $.get('/api/v1/game/' + res.gameId, function(res) {
            joinID = res.joinId;
            $.get('/api/v1/level/' + levelId, function(res) {
                lvl = res;
                comHandle.connect("localhost", "4001", handleMessage);
            });
        });
    });
});