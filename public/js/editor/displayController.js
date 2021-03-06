class DisplayController {
    constructor() {
        this.boardSize = $('#board-anchor').width();
        $('#startModal').show();
        $('#modalOverlay').show();
        $('#miniWinFormGroup').hide();
        $('#miniWinSpecsFormGroup').hide();
        $('#contactFormGroup').hide();

        this.adjustScreen();
        window.onresize = function() {
            this.adjustScreen();
        }.bind(this);
    }

    mobilecheck() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    adjustScreen() {
        if (this.mobilecheck() 
            || ($('#nav').css("left") == "0px" && (window.innerWidth <= 900 || Math.abs(window.innerWidth - window.innerHeight) < 250))) {
            $('#nav').css("left", "-250px");
            $('#board-container').css("left", "0px");
            $('#btn_menu').show();
        } else if ($('#nav').css("left") == "-250px" && window.innerWidth > 900 && (window.innerWidth - window.innerHeight) >= 250) {
            $('#nav').css("left", "0px");
            $('#board-container').css("left", "250px");
            $('#btn_menu').hide();
        }   // later if condition: adjust for if sidebar is opened, vmin on width of board-container is not accurate anymore
    }

    static startGame() {
        $('#startModal').hide();
        $('#modalOverlay').hide();
        $('#board-container').show();
    }

    static toggleClick() {
        if($('#nav').css("left") == "-250px") {
            $('#overlay').fadeIn(200);
            $('#nav').animate({left: "0px"}, 200);
            $('#btn_menu').css("background", "url('/img/close_menu.png') no-repeat scroll center center / 75% 75% #FFF");
        } else {
            $('#overlay').fadeOut(200);
            $('#nav').animate({left: "-250px"}, 200);
            $('#btn_menu').css("background", "url('/img/save_icon.png') no-repeat scroll center center / 60% 60% #FFF");
        }
    };

    static checkToggleOptionsOnType() {
        let type = $('select[name="type"]').val();
        if (type == 'minischach') {
            $('#subtypeFormGroup').hide();
            $('#minTurnsFormGroup').hide();
            $('#miniWinFormGroup').show();
            let wincondition = parseInt($('select[name="miniWin"]').val());
            if (wincondition === constants.winCondition.FIG_REACHES_FIELD)
                $('#miniWinSpecsFormGroup').show();
            else
                $('#miniWinSpecsFormGroup').hide();
        } else {
            $('#subtypeFormGroup').show();
            if (type == 'mp')
                $('#minTurnsFormGroup').hide();
            else
                $('#minTurnsFormGroup').show().attr('');
            $('#miniWinFormGroup').hide();
            $('#miniWinSpecsFormGroup').hide();
        }
    };

    static toggleWannaContact() {
        $('#wannaContactFormGroup').hide();
        $('#contactFormGroup').show();
    };

    static setSelectionWindow(picSrc) {
        $('#selection').html(`
            <img src="/img/${picSrc}">
        `);
    };

    static clearSelection() {
        $('#selection').html("");
    };

    static getLevelAttributes() {
        let type = $('#type').val();
        let contactName = $('#contactName').val();
        let contactEmail = $('#contactEmail').val();
        let contactAddress = $('#contactAddress').val();
        let attrs = {
            _id: type +"-"+ new Date().toLocaleString().replace(/\/| |:/g, "_").replace(/,/g, "").slice(0,-3),
            type: type,
            name: {},
            description: {},
            reviewStatus: reviewStatus.FRESH
        };
        Object.keys(strings).forEach(function(l){
            if (l !== lang) {
                attrs.name[l] = "???";
                attrs.description[l] = "???";
            } else {
                attrs.name[l] = $('#name').val();
                attrs.description[l] = $('#description').val();
            }
        });

        if (type === 'sp' || type === 'mp')
            attrs.subtype = $('#subtype').val();
        if (type === 'sp')
            attrs.minturns = parseInt($('#minturns').val());
        if (type === 'minischach') {
            let miniWin = parseInt($('#miniWin').val());
            if (miniWin === constants.winCondition.FIG_REACHES_FIELD) {
                attrs.winSpecs = {
                    "figure": parseInt($('#miniWinFigure').val()),
                    "field": {
                        "x": parseInt($('#miniWinFieldX').val()),
                        "y": parseInt($('#miniWinFieldY').val())
                    },
                    "player": parseInt($('#miniWinPlayer').val())
                }
            }
            attrs.win = miniWin;
        }
        if (contactName !== "" || contactEmail !== "" || contactAddress !== "") {
            attrs.contact = {
                "name": contactName,
                "email": contactEmail,
                "address": contactAddress
            };
        }
        return attrs;
    };
}