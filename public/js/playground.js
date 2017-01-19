var toggleSidebar = function() {
    $('#wrapper').hasClass('toggled') ? $('#wrapper').removeClass('toggled') : $('#wrapper').addClass('toggled');
}

var startGame = function() {
    $('#startModal').removeClass('show');

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var lvl = JSON.parse(this.responseText);
            $('#lvlName').innerHTML = lvl.name;
            $('#lvlDescription').innerHTML = lvl.description;

            PixiEngine.destroy();
            PixiEngine.init(600, 600, 0, document.getElementById('board-anchor'), function() {
                PixiEngine.loadLevel(lvl, function() {
                    PixiEngine.render();
                });
            });
        }
    }
    xmlhttp.open("GET", "/api/v1/level/" + window.location.href.split('/')[4]);    // TODO: less UGLY? ...
    xmlhttp.send();

}