var lang = "";

var redirectGlobal = function(gameId) {
    $.get('/api/v1/game/' + gameId, function(res) {     // register yourself
        window.location = '/' + lang + '/global/' + gameId + '?joinId=' + res.joinId;
    });
};

let globalCheckForMini = function() {
    let selected = $('#newLevel-select');
    let category = selected[0].options[selected[0].selectedIndex].getAttribute('category');
    if (category === 'mini') {
        $('#newGameRadioUnbeatable')
            .attr('data-toggle', 'tooltip')
            .attr('title', strings[lang].modals.menu.mp_g.disables_mini)
            .attr('disabled', true);
        document.getElementById("newGameRadioBeatable").checked = true
    } else {
        $('#newGameRadioUnbeatable').attr('disabled', false);
    }
}

var createNewGame = function() {
    let selected = $('#newLevel-select')
    let name = $('#newName').val(),
        level = selected.val(),
        category = selected[0].options[selected[0].selectedIndex].getAttribute('category'),
        mode = $('input[name="gameMode"]:checked').val();
    console.log(name, level, category, mode);

    if (mode === undefined) {
        toastr.warning(strings[lang].toasts.no_mode_selected);
    } else if (name === "") {
        toastr.warning(strings[lang].toasts.no_name_provided);
    } else {
        let newGame = {
            local: 'false',
            name: name,
            level: level,
            mode: mode
        };
        newGame.type = category !== 'mini' ? 'MP' : 'MINI';

        $.post('/api/v1/game', newGame, function(res) {
            console.log(res);
            redirectGlobal(res.gameId);
        });
    }
};

$('document').ready(function() {
    lang = window.location.pathname.split('/')[1];
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
        });
    });

    $.get('/api/v1/level', function(availLvls) {
        availLvls.forEach(function(lvl) {
            if (lvl.type === 'mp' && lvl.reviewStatus !== reviewStatus.FRESH)
                $('#newLevel-select').append(`
                    <option category="${lvl.subtype}" value="${lvl._id}">
                        ${lvl.name[lang]}
                    </option>
                `);
            if (lvl.type === 'minischach' && lvl.reviewStatus !== reviewStatus.FRESH) {
                $('#newLevel-select').append(`
                    <option category="mini" value="${lvl._id}">
                        ${lvl.name[lang]}
                    </option>
                `);
                globalCheckForMini();
            }

            if (lvl.type === 'sp' || lvl.type === 'mp')
                if (lvl.reviewStatus !== reviewStatus.FRESH)
                    $('#' + lvl.type + lvl.subtype + '_panel-body').append(`
                        <p>
                            <a href="/${lang}/${lvl.type}/${lvl.subtype}/${lvl._id}">
                                ${lvl.name[lang]}
                            </a>
                        </p>
                    `);
                else
                    $('#' + lvl.type + '__fresh_panel-body').append(`
                        <p>
                            <a href="/${lang}/${lvl.type}/${lvl.subtype}/${lvl._id}">
                                ${lvl.name[lang]}
                            </a>
                        </p>
                    `);

            if (lvl.type === 'minischach')
                if (lvl.reviewStatus !== reviewStatus.FRESH)
                    $('#miniLevels').append(`
                        <p>
                            <a href="/${lang}/mini/${lvl._id}">
                                ${lvl.name[lang]}
                            </a>
                        </p>
                    `);
                else 
                    $('#mini__fresh_panel-body').append(`
                        <p>
                            <a href="/${lang}/mini/${lvl._id}">
                                ${lvl.name[lang]}
                            </a>
                        </p>
                    `);                    
        });
    });
});
