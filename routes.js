const fs = require('fs');
const path = require('path');

module.exports = function(app, dataAccess) {
    let strings = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'public/strings.json'), 'utf8'));

    app.get('/', function(req, res) {
        res.redirect('/de');    // default: German
    });

    app.get('/:lang', function(req, res) {
        let lang = req.params.lang;
        res.render('menu', {
            lang: lang,
            strings: strings[lang],
            iconRows: [
                [
                    {id:'sp', picId:'single', name: strings[lang].menu.iconRows_names[0][0], status: 'white'},
                    {id:'mp', picId:'multiLocal', name: strings[lang].menu.iconRows_names[0][1], status: 'white'},
                    {id:'mp_g', picId:'multiGlobal', name: strings[lang].menu.iconRows_names[0][2], status: 'white'}
                ],[
                    {id:'mini', picId:'mini', name: strings[lang].menu.iconRows_names[1][0], status: 'white'},
                    {id:'impressum', picId:'logoLg', name: strings[lang].menu.iconRows_names[1][1]},
                    {id:'classic', picId:'classic', name: strings[lang].menu.iconRows_names[1][2], status: 'red'}
                ],[
                    {id:'editor', picId:'editor', name: strings[lang].menu.iconRows_names[2][0], status: 'white'},
                    {id:'help', picId:'help', name: strings[lang].menu.iconRows_names[2][1], status: 'white'},
                    {id:'exit', picId:'close_.75opacity', name: strings[lang].menu.iconRows_names[2][2]}
                ]
            ],
            accTypes: [
                {id: 'sp', name: strings[lang].menu.accTypes[0].name, footer: strings[lang].menu.accTypes[0].footer},
                {id: 'mp', name: strings[lang].menu.accTypes[1].name, footer: strings[lang].menu.accTypes[1].footer}
            ],
            availSubtypes: [
                {id: 'rook', name: strings[lang].menu.availSubtypes_names[0]},
                {id: 'bishop', name: strings[lang].menu.availSubtypes_names[1]},
                {id: 'queen', name: strings[lang].menu.availSubtypes_names[2]},
                {id: 'king', name: strings[lang].menu.availSubtypes_names[3]},
                {id: 'knight', name: strings[lang].menu.availSubtypes_names[4]},
                {id: 'pawn', name: strings[lang].menu.availSubtypes_names[5]}
            ],
            strings: strings[lang]
        });
    });

    app.get('/:lang/:type/:subtype/:levelId', function(req, res) {      // 'sp' OR 'mp'
        let lang = req.params.lang;
        res.render('playground', {
            lang: lang,
            type: req.params.type,
            subtype: req.params.subtype,
            id: req.params.levelId,
            title: strings[lang].playground.titles[req.params.type],
            footer: strings[lang].playground.footers[req.params.type],
            strings: strings[lang]
        });
    });

    app.get('/:lang/global/:gameId', function(req, res) {
        let lang = req.params.lang;
        res.render('playground', {
            lang: lang,
            type: 'global',
            subtype: 'NotDefined',
            id: req.params.gameId,
            title: strings[lang].playground.titles[req.params.type],
            footer: 'Ein globales Mehrspieler Spiel.',
            strings: strings[lang]
        });
    });

    app.get('/:lang/mini/:levelId', function(req, res) {
        let lang = req.params.lang;
        res.render('playground', {
            lang: lang,
            type: 'mini',
            subtype: 'NotDefined',
            id: req.params.levelId,
            title: strings[lang].playground.titles[req.params.type],
            footer: strings[lang].playground.footers[req.params.type],
            strings: strings[lang]
        })
    });

    app.get('/:lang/editor', function(req, res) {
        let lang = req.params.lang;
        res.render('editor', {
            lang: lang,
            figuresBlue: [
                {type: 'ROOK', picSrc: 'RookBlue.png'},
                {type: 'BISHOP', picSrc: 'BishopBlue.png'},
                {type: 'QUEEN', picSrc: 'QueenBlue.png'},
                {type: 'KING', picSrc: 'KingBlue.png'},
                {type: 'KNIGHT', picSrc: 'KnightBlue.png'},
                {type: 'PAWN', picSrc: 'PawnBlue.png'}
            ],
            figuresYellow: [
                {type: 'ROOK', picSrc: 'RookYellow.png'},
                {type: 'BISHOP', picSrc: 'BishopYellow.png'},
                {type: 'QUEEN', picSrc: 'QueenYellow.png'},
                {type: 'KING', picSrc: 'KingYellow.png'},
                {type: 'KNIGHT', picSrc: 'KnightYellow.png'},
                {type: 'PAWN', picSrc: 'PawnYellow.png'}
            ],
            chips: [
                {type: 1, picSrc: 'ChipBlue.png'},
                {type: 0, picSrc: 'ChipYellow.png'},
                {type: 2, picSrc: 'ChipGreen.png'},
                {type: 3, picSrc: 'ChipRed.png'}
            ],
            type_options: [
                {value: 'sp', name: strings[lang].editor.prop_form.type_options[0]},
                {value: 'mp', name: strings[lang].editor.prop_form.type_options[1]},
                {value: 'minischach', name: strings[lang].editor.prop_form.type_options[2]}
            ],
            subtype_options: [
                {value: 'rook', name: strings[lang].editor.prop_form.subtype_options[0]},
                {value: 'bishop', name: strings[lang].editor.prop_form.subtype_options[1]},
                {value: 'queen', name: strings[lang].editor.prop_form.subtype_options[2]},
                {value: 'king', name: strings[lang].editor.prop_form.subtype_options[3]},
                {value: 'knight', name: strings[lang].editor.prop_form.subtype_options[4]},
                {value: 'pawn', name: strings[lang].editor.prop_form.subtype_options[5]}
            ],
            wincondition_options: [
                {value: 2, name: strings[lang].editor.prop_form.wincondition_options[0]},
                {value: 3, name: strings[lang].editor.prop_form.wincondition_options[1]}
            ],
            wincondition_specs_figure: [
                {value: 1, name: strings[lang].general.figures[0]},
                {value: 2, name: strings[lang].general.figures[1]},
                {value: 3, name: strings[lang].general.figures[2]},
                {value: 4, name: strings[lang].general.figures[3]},
                {value: 5, name: strings[lang].general.figures[4]},
                {value: 6, name: strings[lang].general.figures[5]}
            ],
            wincondition_specs_player: [
                {value: 0, name: strings[lang].general.players[0]},
                {value: 1, name: strings[lang].general.players[1]}
            ],
            strings: strings[lang]
        });
    });
};
