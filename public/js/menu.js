var redirectGlobal = function(gameId) {
    window.location = '/global/' + gameId;
};

var createNewGame = function() {
    let name = $('#newName').val(),
        level = $('#newLevel-select').val(),
        mode = $('input[name="gameMode"]:checked').val();
    console.log(name, level, mode);

    if (mode === undefined) {
        toastr.warning('Bitte wähle einen Modus für das neue Spiel aus.');
    } else if (name === "") {
        toastr.warning('Bitte benenne deine neues Spiel.');
    } else {
        let newGame = {
            type: 'MP',
            local: 'false',
            name: name,
            level: level,
            mode: mode
        };

        $.post('/api/v1/game', newGame, function(res) {
            console.log(res);
            redirectGlobal(res.gameId);
        });
    }
};

$('document').ready(function() {
    $.get('/api/v1/game', function(globalGames) {
        globalGames.forEach(function(game) {
            let levelSuffix = game.mode === 'unbeatable' ? "(schlagen aus)" : "(schlagen an)";
            let joinable = game.filledSeats < 2;
            $('#globalGames_tbody').append(`
                <tr>
                    <td>${game.name}</td>
                    <td>
                        ${game.level}<br>
                        ${levelSuffix}
                    </td>
                    <td style="text-align: center;">
                        ${game.filledSeats}/2
                    </td>
                    <td style="text-align: center;">
                        <a onclick="redirectGlobal('${game.id}');" class="btn btn-primary btn-sm" ${!joinable?"style='display: none;'":""}>
                            Beitreten
                        </a>
                        <a class="btn btn-danger btn-sm disabled" ${joinable?"style='display: none;'":""}>
                            Bereits voll
                        </a>
                    </td>
                </tr>
            `);
            console.log('tets');
        });
    });
    $.get('/api/v1/level', function(availLvls) {
        availLvls.forEach(function(lvl) {
            if (lvl.type === 'mp')
                $('#newLevel-select').append(`
                    <option value="${lvl._id}">
                        ${lvl.name}
                    </option>
                `);
            if (lvl.type === 'sp' || lvl.type === 'mp' || lvl.type === 'mini')
                $('#' + lvl.type + lvl.subtype + '_panel-body').append(`
                    <p>
                        <a href="/${lvl.type}/${lvl.subtype}/${lvl._id}">
                            ${lvl.name}
                        </a>
                    </p>
                `);
        });
    });
});
