var lvl;

var toggleSidebar = function() {
    $('#wrapper').hasClass('toggled') ? $('#wrapper').removeClass('toggled') : $('#wrapper').addClass('toggled');
};

var startGame = function() {
    if (lvl !== undefined) {
        $('#startModal').removeClass('show');

        PixiEngine.destroy();
        PixiEngine.init(600, 600, 0, document.getElementById('board-anchor'), function() {
            PixiEngine.loadLevel(lvl, function() {
                PixiEngine.render();
            });
        });
    } else      // if hitting start just fast enough lvl is not loaded already
        toastr.info('Level wird noch geladen, einen Moment Geduld noch ...');
};

$('document').ready(function() {
    levelId = window.location.href.split('/')[4];
    $.post('/api/v1/game', {type: 'SP', level: levelId, mode: 'unbeatable'}, function(res) {
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