var gameID, joinID, lvl;


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

var handleMessage = function(msg) {
    var msgObj = JSON.parse(msg.data);
    console.log("Server> ", msgObj);

    evaluate(msgObj);
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
    comHandle.send(JSON.stringify(moveObj));
}

var evaluate = function(message) {
    switch(message.type) {
        case "turn":
            PixiEngine.moveFigure(message.origX, message.origY, message.destX, message.destY);
        break;
        case "error":
            toastr.error('MEEP Error!');
        break;
    }
}


$('document').ready(function() {
    let levelId = window.location.href.split('/')[4];

    $.post('/api/v1/game', {type: 'SP', level: levelId, mode: 'unbeatable'}, function(res) {
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
