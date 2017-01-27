var lvl;

var toggleSidebar = function() {
    $('#wrapper').hasClass('toggled') ? $('#wrapper').removeClass('toggled') : $('#wrapper').addClass('toggled');
};

var startGame = function() {
    if (lvl !== undefined) {
        $('#startModal').removeClass('show');

        PixiEngine.destroy();
        PixiEngine.init(600, 600, opMode.MP, document.getElementById('board-anchor'), function() {
            PixiEngine.loadLevel(lvl, function() {
                PixiEngine.render();
            });
        });
    } else      // if hitting start just fast enough ajax has not gone through and lvl is not loaded already
        toastr.info('Level wird noch geladen, einen Moment Geduld noch ...');
};

$('document').ready(function() {
    var levelId = window.location.href.split('/')[4],
        mode = window.location.href.split('/')[5];
    for (var i = 0; i < 2; i++)
        $.post('/api/v1/game', {type: 'MP', level: levelId, mode: mode}, function(res) {
            $.get('/api/v1/game/' + res.gameId, function(res) {
                console.log('You joined a game:', res);
                $.get('/api/v1/level/' + levelId, function(res) {
                    lvl = res;
                });
            });
        });

    //////
    /// AJAX ... just in case I guess ^^
    // var xmlhttp = new XMLHttpRequest();
    // xmlhttp.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {
    //         lvl = JSON.parse(this.responseText);
    //         console.log('Level retrieved: ', lvl);
    //     }
    // }
    // xmlhttp.open("GET", "/api/v1/level/" + window.location.href.split('/')[4]);
    // xmlhttp.send();
});