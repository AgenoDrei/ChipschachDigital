module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('menu', {
            iconRows: [
                [
                    {id:'sp', picId:'single', name:'Einzelspieler'},
                    {id:'mp', picId:'multiLocal', name:'Mehrspieler Lokal'},
                    {id:'mp_g', picId:'multiGlobal', name:'Mehrspieler Global'}
                ],[
                    {id:'mini', picId:'mini', name:'Minischach'},
                    {id:'impressum', picId:'logoLg', name:''},
                    {id:'classic', picId:'classic', name:'Klassisches Schach'}
                ],[
                    {id:'editor', picId:'editor', name:'Editor'},
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
            },{
                id: 'mini',
                name: 'Mehrspieler Lokal - Minischach',
                footer: 'Wähle ein Minischach-Level aus und löse das knifflige Schach-Rätsel!!'
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
            footerText = "Löse das Level in möglichst wenig Zügen indem du alle schlagbaren Chips schlägst!";
        } else if (req.params.type === 'mp') {
            footerText = "Schlagen mehr Chips als dein Gegner!";
        } else if (req.params.type === 'mini') {
            //TODO
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
            footer: "Ein globales Mehrspieler Spiel."
        });
    });

    app.get('/editor', function(req, res) {
        res.render('editor', {
            figuresBlue: [
                {id: 'rook', picSrc: 'RookBlue.png'},
                {id: 'bishop', picSrc: 'BishopBlue.png'},
                {id: 'queen', picSrc: 'QueenBlue.png'},
                {id: 'king', picSrc: 'KingBlue.png'},
                {id: 'knight', picSrc: 'KnightBlue.png'},
                {id: 'pawn', picSrc: 'PawnBlue.png'}
            ],
            figuresYellow: [
                {id: 'rook', picSrc: 'RookYellow.png'},
                {id: 'bishop', picSrc: 'BishopYellow.png'},
                {id: 'queen', picSrc: 'QueenYellow.png'},
                {id: 'king', picSrc: 'KingYellow.png'},
                {id: 'knight', picSrc: 'KnightYellow.png'},
                {id: 'pawn', picSrc: 'PawnYellow.png'}
            ],
            chips: [
                {id: 'blue', picSrc: 'ChipBlue.png'},
                {id: 'yellow', picSrc: 'ChipYellow.png'},
                {id: 'green', picSrc: 'ChipGreen.png'},
                {id: 'red', picSrc: 'ChipRed.png'}
            ]
        });
    })
};
