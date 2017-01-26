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
                PixiEngine.render();
            });
        });
    } else      // if hitting start just fast enough lvl is not loaded already
        toastr.info('Level wird noch geladen, einen Moment Geduld noch ...');
};



$('document').ready(function() {
    let levelId = window.location.href.split('/')[4];

    $.post('/api/v1/game', {type: 'SP', level: levelId, mode: 'unbeatable'}, function(res) {
        gameID = res.gameId;
        $.get('/api/v1/game/' + res.gameId, function(res) {
            joinID = res.joinId;
            $.get('/api/v1/level/' + levelId, function(res) {
                lvl = res;

                if (window.WebSocket) {
                    ws = new WebSocket('ws://localhost:4001', 'kekse');

                    ws.onopen = function() {
                        ws.send(JSON.stringify({
                            type: 'hello',
                            gameId: gameID,
                            joinID: joinID
                        }));
                    };

                    ws.onmessage = function(e) {
                      console.log('Server:', e.data)
                    };
                    // ws.addEventListener('message', function(msg) {
                    //     console.log(msg);
                    // });
                } else {
                    alert('Dieser Browser ist nicht aktuell genug (kein Websocket Support).');
                    //TODO: ... implement alternative ? ...
                }
            });
        });
    });

});