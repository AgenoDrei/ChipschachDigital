module.exports = function(app, dataAccess) {
    app.get('/', function(req, res) {
        res.render('menu', {
            iconRows: [
                [
                    {id:'sp', picId:'single', name:'Einzelspieler', status: 'white'},
                    {id:'mp', picId:'multiLocal', name:'Mehrspieler Lokal', status: 'white'},
                    {id:'mp_g', picId:'multiGlobal', name:'Mehrspieler Global', status: 'white'}
                ],[
                    {id:'mini', picId:'mini', name:'Minischach', status: 'white'},
                    {id:'impressum', picId:'logoLg', name:''},
                    {id:'classic', picId:'classic', name:'Klassisches Schach', status: 'red'}
                ],[
                    {id:'editor', picId:'editor', name:'Editor', status: 'orange'},
                    {id:'', picId:'', name:''},
                    {id:'exit', picId:'close_.75opacity', name:'Verlassen'}
                ]
            ],
            accTypes: [{
                id: 'sp',
                name: 'Einzelspieler',
                footer: 'Wähle ein Einzelspieler-Level und schlage alle Chips so schnell du kannst!'
            }, {
                id: 'mp',
                name: 'Mehrspieler Lokal',
                footer: 'Wähle ein Mehrspieler-Level aus um gegen einen Freund am gleichen Rechner Problemstellungen zu lösen!'
            }],
            availSubtypes: [
                {id: 'rook', name: 'Turm'},
                {id: 'bishop', name: 'Läufer'},
                {id: 'queen', name: 'Dame'},
                {id: 'king', name: 'König'},
                {id: 'knight', name: 'Springer'},
                {id: 'pawn', name: 'Bauer'}
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
