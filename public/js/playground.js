var lvl;
var forceReloadCounter = 0;

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
    } else if (forceReloadCounter > 1) {       // VERY RARELY hitting the button won't do anything, reload resolves
        window.location.reload();
    } else {    // if hitting start just fast enough ajax has not gone through and lvl is not loaded already
        toastr.info('Level wird noch geladen, einen Moment Geduld noch ...')
        forceReloadCounter++;
    }
};

$('document').ready(function() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            lvl = JSON.parse(this.responseText);
            console.log('Level retrieved: ', lvl);
        }
    }
    xmlhttp.open("GET", "/api/v1/level/" + window.location.href.split('/')[4]);    // TODO: hardcoded split stuff? ...
    xmlhttp.send();
});