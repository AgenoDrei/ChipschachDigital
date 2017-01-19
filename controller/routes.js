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
                {id:'', picId:'', name:''},
                {id:'editor', picId:'editor', name:'Editor'},
                {id:'', picId:'', name:''}
            ]
        ];
        var accTypes = [
            {id: 'sp', name: 'Lokaler Einzelspieler', href: 'singleplayer'},
            {id: 'mp', name: 'Lokaler Mehrspieler', href: 'multiplayer'},
            {id: 'mini', name: 'Minischach-Aufgaben', href: 'minichess'}
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

    app.get('/singleplayer/:levelId', function(req, res) {
        console.log(nameDict);
        res.render('singleplayer', {
            name: nameDict[req.params.levelId],
            descr: descrDict[req.params.levelId]
        });
    });

    app.get('/multiplayer/:levelId', function(req, res) {
        res.render('multiplayer', {
            name: nameDict[req.params.levelId],
            descr: descrDict[req.params.levelId]
        });
    });
};
