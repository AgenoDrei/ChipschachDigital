module.exports = function(app, dataAccess) {
    app.get('/', function(req, res) {
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

        dataAccess.getAllLevelIds().then(function(availLvls) {
            console.log('Available Levels retrieved');
            res.render('menu', {
                iconRows: iconRows,
                accTypes: accTypes,
                availSubtypes: availSubtypes,   //TODO: only show actually available ones
                availLvls: availLvls
            });
        });
    });

    app.get('/singleplayer', function(req, res) {
       res.render('singleplayer', {});
    });
};
