var gameID, joinID, lvl, ws;


var toggleSidebar = function() {
    $('#wrapper').hasClass('toggled') ? $('#wrapper').removeClass('toggled') : $('#wrapper').addClass('toggled');
};

var startGame = function() {
    if (lvl !== undefined) {
        $('#startModal').removeClass('show');

        PixiEngine.destroy();
        PixiEngine.init(600, 600, opMode.SP, document.getElementById('board-anchor'), function() {
            PixiEngine.loadLevel(lvl, function() {
                PixiEngine.setMoveCallback(handleMoves);
                PixiEngine.render();
            });
        });
    } else      // if hitting start just fast enough lvl is not loaded already
        toastr.info('Level wird noch geladen, einen Moment Geduld noch ...');
};

var createConnection = function() {
    if (window.WebSocket) {
        ws = new WebSocket('ws://localhost:4001', 'kekse');
        ws.onopen = function() {
            var conObj = {
                type: 'hello',
                gameId: gameID,
                joinId: joinID
            };
            console.log("Client> ", conObj);
            ws.send(JSON.stringify(conObj));
        };
                    
        ws.onmessage = handleMessage;
                    
    } else {
        alert('Dieser Browser ist nicht aktuell genug (kein Websocket Support).');
        //TODO: ... implement alternative ? ...
    }
}

var handleMessage = function(msg) {
    var msgObj = JSON.parse(msg.data);
    console.log("Server> ", msgObj);
} 

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
    ws.send(JSON.stringify(moveObj));
}



$('document').ready(function() {
    let levelId = window.location.href.split('/')[4];

    $.post('/api/v1/game', {type: 'SP', level: levelId, mode: 'unbeatable'}, function(res) {
        gameID = res.gameId;
        $.get('/api/v1/game/' + res.gameId, function(res) {
            joinID = res.joinId;
            $.get('/api/v1/level/' + levelId, function(res) {
                lvl = res;
                createConnection();
            });
        });
    });

});
