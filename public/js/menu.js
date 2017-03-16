var redirectGlobal = function(gameId) {
    window.location = '/global/' + gameId;
};

$('document').ready(function() {
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
