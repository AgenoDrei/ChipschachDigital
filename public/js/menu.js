let lang = "",
    LOAD_OPEN_GAMES_INTERVAL = 2500;

var redirectGlobal = function(gameId) {
    $.get('/api/v1/game/' + gameId, function(res) {     // register yourself
        window.location = '/' + lang + '/global/' + gameId + '?joinId=' + res.joinId;
    });
};

let loadOpenGames = function() {
    $('.openGame').remove();
    $('#openGamesPlaceholder').show();
    $.get('/api/v1/game', function(globalGames) {
        globalGames.forEach(function(game) {
            let levelSuffix = game.mode === 'unbeatable' ? "("+strings[lang].modals.menu.mp_g.new_game_form.unbeatable+")" : "("+strings[lang].modals.menu.mp_g.new_game_form.beatable+")";
            let joinable = game.filledSeats < 2;
            $('#globalGames_tbody').append(`
                <tr class="openGame">
                    <td>${game.name}</td>
                    <td>
                        ${game.level[lang]}<br>
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
            $('#openGamesPlaceholder').hide();
        });
    });
};

let filterForCheckedCategory = function() {
    let selected = $('#newLevel-select');
    let category = selected[0].options[selected[0].selectedIndex].getAttribute('category');

    let checkboxes = $('.categoryFilter');
    for (key in checkboxes) {
        let opts = $('option[category="' + checkboxes[key].value + '"]');
        if (!checkboxes[key].checked)
            opts.hide();
        else
            opts.show();
    }

}

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

    loadOpenGames();
    setInterval(loadOpenGames, LOAD_OPEN_GAMES_INTERVAL);

    $.get('/api/v1/level', function(availLvls) {
        availLvls.forEach(function(lvl) {
            /* filling global */
            if (lvl.reviewStatus === reviewStatus.OFFICIAL) {
                if (lvl.type === 'mp') {
                    $('#newLevel-select').append(`
                        <option category="${lvl.subtype}" value="${lvl._id}">
                            ${lvl.name[lang]}
                        </option>
                    `);
                }
                if (lvl.type === 'minischach') {
                    $('#newLevel-select').append(`
                        <option category="mini" value="${lvl._id}">
                            ${lvl.name[lang]}
                        </option>
                    `);
                    globalCheckForMini();       // checked for each lvl inserted in case it is the latest one; not the best way to handle this
                }
            }

            /* filling sp & mp local */
            if (lvl.type === 'sp' || lvl.type === 'mp')
                if (lvl.reviewStatus === reviewStatus.OFFICIAL) {
                    try {
                        $('#' + lvl.type + lvl.subtype + '_panel-body').append(`
                            <p>
                                <a href="/${lang}/${lvl.type}/${lvl.subtype}/${lvl._id}">
                                    ${lvl.name[lang]}
                                </a>
                            </p>
                        `);
                    } catch (e) {
                        console.log(lvl);
                    }
                } else if (lvl.reviewStatus === reviewStatus.REVIEWED) {
                    $('#' + lvl.type + '__reviewed_panel-body').append(`
                    <p>
                        <a href="/${lang}/${lvl.type}/${lvl.subtype}/${lvl._id}">
                            ${lvl.name[lang]}
                        </a>
                    </p>
                `);
                } else if (lvl.reviewStatus === reviewStatus.FRESH) {
                    $('#' + lvl.type + '__fresh_panel-body').append(`
                        <p>
                            <a href="/${lang}/${lvl.type}/${lvl.subtype}/${lvl._id}">
                                ${lvl.name[lang]}
                            </a>
                        </p>
                    `);
                } else {
                    throw new Error('Invalid review-status');
                }

            /* fillling mini local */
            if (lvl.type === 'minischach')
                if (lvl.reviewStatus === reviewStatus.OFFICIAL) {
                    $('#miniLevels').append(`
                        <p>
                            <a href="/${lang}/mini/${lvl._id}">
                                ${lvl.name[lang]}
                            </a>
                        </p>
                    `);
                } else if (lvl.reviewStatus === reviewStatus.REVIEWED) {
                    $('#mini__reviewed_panel-body').append(`
                        <p>
                            <a href="/${lang}/mini/${lvl._id}">
                                ${lvl.name[lang]}
                            </a>
                        </p>
                    `);   
                } else if (lvl.reviewStatus === reviewStatus.FRESH) {
                    $('#mini__fresh_panel-body').append(`
                        <p>
                            <a href="/${lang}/mini/${lvl._id}">
                                ${lvl.name[lang]}
                            </a>
                        </p>
                    `);   
                } else {
                    throw new Error('Invalid review-status');
                }                 
        });
    });
});
