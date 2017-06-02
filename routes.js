var fs = require('fs');

module.exports = function(app, dataAccess) {
    var strings = JSON.parse(fs.readFileSync('./config/strings.json', 'utf8'));

    app.get('/', function(req, res) {
        res.redirect('/de');    // default: German
    });

    app.get('/:lang', function(req, res) {
        var lang = req.params.lang;
        res.render('menu', {
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
            ]
        });
    });

    app.get('/:type/:subtype/:levelId', function(req, res) {
        let type = req.params.type.toUpperCase(),
            footerText = "";
        if (req.params.type === 'sp') {
            footerText = "Löse das Level in möglichst wenig Zügen in dem du alle schlagbaren Chips schlägst!";
        } else if (req.params.type === 'mp') {
            footerText = "Schlagen mehr Chips als dein Gegner!";
        }
        res.render('playground', {
            type: req.params.type.toUpperCase(),    // toUpperCase is not the nicest way to go here, but nvmd
            subtype: req.params.subtype,
            id: req.params.levelId,
            footer: footerText
        });
    });

    app.get('/global/:gameId', function(req, res) {
        res.render('playground', {
            type: 'GLOBAL',
            subtype: 'NotDefined',
            id: req.params.gameId,
            footer: 'Ein globales Mehrspieler Spiel.'
        });
    });

    app.get('/mini/:levelId', function(req, res) {
        res.render('playground', {
            type: 'MINI',
            subtype: 'NotDefined',
            id: req.params.levelId,
            footer: 'Ein kniffliges Schach-Rätsel!'
        })
    });

    app.get('/editor', function(req, res) {
        res.render('editor', {
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
            ]
        });
    });
    app.post('/editor', function(req, res) {
        let level = JSON.parse(req.body.level);
        console.log('Retrieved EditorLvl: ', level);
        dataAccess.createLevel(level).done(function(doc) {
            console.log('Received doc from dataAccess: ', doc);
        });
    });
};
