const FONTSIZERATIO = 0.04;

var adjustCss= function() {
    var cw = $('.innerrow').width();
    $('.innerrow').css({
        'font-size':cw*FONTSIZERATIO+'px'
    });
    cw = $('.col-xs-4').width();
    $('.menuIcon').css({
        'width':cw+'px',
        'height':cw+'px'
    });

    var marginVal = (window.innerHeight - $('.container').height()) / 2;
    $('.container').css({
        'margin-top':marginVal+'px'
    });
};

var redirectGlobal = function(gameId) {
    window.location = '/global/' + gameId;
};

window.onresize = function() {
    adjustCss();
};
$('document').ready(function() {
    adjustCss();

    $('#createGame').on('submit', function(e){
        // TODO: formal html5 validating and form parameter picking...
        let name = $('#newName').val(),
            levelId = $('#newLevel').val(),
            mode = $('input[name="gameMode"]:checked').val();

        if (mode === undefined) {
            toastr.warning('Bitte wähle einen Modus für das neue Spiel aus.');
        } else if (name === "") {
            toastr.warning('Bitte benenne deine neues Spiel.');
        } else {
            var newGame = {
                type: 'MP',
                local: 'false',
                name: name,
                level: levelId,
                mode: mode
            };

            $.post('/api/v1/game', newGame, function(res) {
                redirectGlobal(res.gameId);
            });
        }

        e.preventDefault();
    });
});
