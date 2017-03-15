module.exports = function(app, dataAccess, gameHandler) {
        var nameDict = {},
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
            {id: 'sp', name: 'Lokaler Einzelspieler',
                footer: 'Wähle ein Einzelspieler-Level und schlage alle Chips so schnell du kannst!'},
            {id: 'mp', name: 'Lokaler Mehrspieler',
                footer: 'Wähle ein Mehrspieler-Level aus um gegen einen Freund am gleichen Rechner Problemstellungen zu lösen!'},
            {id: 'mini', name: 'Minischach-Aufgaben',
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
            gameHandler.getGameList().then(function(filteredGames) {        // TODO: not the right way, but not working like this anyways ^...^
                res.render('menu', {
                    iconRows: iconRows,
                    accTypes: accTypes,
                    availSubtypes: availSubtypes,
                    availLvls: obtainedLvls,
                    globalGames: filteredGames
                });
                //saved stuff for mitgeben von name and description when separate level called
                obtainedLvls.forEach(function(lvl) {
                    nameDict[lvl._id] = lvl.name;
                    descrDict[lvl._id] = lvl.description;
                });

            });
        });
    });

    app.get('/:type/:subtype/:levelId', function(req, res) {
        let type = req.params.type.toUpperCase(),
            footerText;
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
            name: nameDict[req.params.levelId],
            descr: descrDict[req.params.levelId],
            footer: footerText,
        });
    });

    app.get('/global/:gameId', function(req, res) {
        //TODO
    });

    app.get('/editor', function(req, res) {
        res.render('editor');
    })
};
