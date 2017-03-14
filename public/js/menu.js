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


window.onresize = function() {
    adjustCss();
};
$('document').ready(function() {
    adjustCss();
});
