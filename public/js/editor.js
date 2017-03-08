/* Sidebar Stuff: */
var toggleSidebar = function() {
    var wrapper = $('#wrapper');
    wrapper.hasClass('toggled') ? wrapper.removeClass('toggled') : wrapper.addClass('toggled');
};
var checkToggleSubtype = function() {
    if ($('select[name="type"]').val() == 'mini') {
        $('#subtypeFormGroup').hide();
        $('#minTurnsFormGroup').hide();
    } else {
        $('#subtypeFormGroup').show();
        $('#minTurnsFormGroup').show();
    }
};
$('select[name="type"]').change(function(){
    // if ($('select[name="type"]').val() === "mini")
        console.log($(this).val());
});
/* ------------------ */





$(document).ready(function() {
    PixiEngine.destroy();
    $('#board-layer-behind').css({
        'width': '640',
        'height': '640',
        'padding': '40',
        'background-image': 'url(/img/board_named.png)'
    });
    PixiEngine.init(560, 560, opMode.EDITOR, document.getElementById('board-anchor'), function() {
        PixiEngine.loadLevel({board:[]}, function() {
            PixiEngine.render();
        });
    });
});