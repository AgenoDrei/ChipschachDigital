module.exports = function(app, dataAccess) {
    var availLvls = [],
        nameDict = {},
        descrDict = {};

    app.get('/', function(req, res) {
        self = this;
        var iconRows = [
            [
                {id:'sp', picId:'single', name:'Einzelspieler'},
                {id:'mp', picId:'multiLocal', name:'Lokaler Mehrspieler'},
                {id:'mini', picId:'mini', name:'Minischach'}
            ],[
                {id:'mp_g', picId:'multiGlobal', name:'Globaler Mehrspieler'},
                {id:'impressum', picId:'logoLg', name:''},
                {id:'classic', picId:'classic', name:'Klassisches Schach'}
            ],[
                {id:'editor', picId:'editor', name:'Editor'},
                {id:'', picId:'', name:''},
                {id:'exit', picId:'close_.75opacity', name:'Verlassen'}
            ]
        ];
        var accTypes = [
            {id: 'sp', name: 'Lokaler Einzelspieler', href: 'SP',
                footer: 'Wähle ein Einzelspieler-Level und schlage alle Chips so schnell du kannst!'},
            {id: 'mp', name: 'Lokaler Mehrspieler', href: 'MP',
                footer: 'Wähle ein Mehrspieler-Level aus um gegen einen Freund am gleichen Rechner Problemstellungen zu lösen!'},
            {id: 'mini', name: 'Minischach-Aufgaben', href: 'MINI',
                footer: 'Wähle ein Minischach-Level aus und löse das knifflige Schach-Rätsel!!'}
        ];
        var availSubtypes = [
            {id: 'pawn', name: 'Bauer'},
            {id: 'knight', name: 'Springer'},
            {id: 'bishop', name: 'Läufer'},
            {id: 'rook', name: 'Turm'},
            {id: 'queen', name: 'Dame'},
            {id: 'king', name: 'König'}
        ];

        dataAccess.getAllLevelIds().then(function(obtainedLvls) {
            res.render('menu', {
                iconRows: iconRows,
                accTypes: accTypes,
                availSubtypes: availSubtypes,
                availLvls: obtainedLvls
            });

            //saved stuff for mitgeben von name and description when separate level called
            this.availLvls = obtainedLvls;
            obtainedLvls.forEach(function(lvl) {
                nameDict[lvl._id] = lvl.name;
                descrDict[lvl._id] = lvl.description;
            });
        });
    });

    app.get('/:type/:levelId', function(req, res) {
        if (req.params.type === 'SP') {
            res.render('singleplayer', {
                name: nameDict[req.params.levelId],
                descr: descrDict[req.params.levelId],
                footer: "Löse das Level in möglichst wenig Zügen indem du alle schlagbaren Chips schlägst!"
            });
        } else if (req.params.type === 'MINI') {
            //TODO
        }
    });

    app.get('/MP/:levelId/:mode', function(req, res) {
        res.render('multiplayer', {
            name: nameDict[req.params.levelId],
            descr: descrDict[req.params.levelId],
            footer: "Schlagen mehr Chips als dein Gegner!"
        });
    });
};
