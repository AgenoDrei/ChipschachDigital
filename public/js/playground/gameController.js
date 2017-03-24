class GameController {
    constructor(pathnamesplit) {
        this.lvlType = pathnamesplit[1];
        this.lvlSubtype = this.lvlType === 'global' ? undefined : pathnamesplit[2];
        this.gameId = this.lvlType === 'global' ? pathnamesplit[2] : undefined;
        this.levelId = this.lvlType === 'global' ? undefined : pathnamesplit[3];
        this.joinIds = [];
        this.lvl = undefined;

        if (this.lvlType === 'global')
            this.connectGlobalGame(window.location.href.split('=')[1], comHandle);
        else if (this.lvlType === 'sp')
            this.connectLocalGame('unbeatable', comHandle, undefined);
    }

    connectGlobalGame(joinId, comHandle) {
        this.joinIds.push(joinId);       // already joined in menu
        $.get('/api/v1/game', function(globalGames) {
            globalGames.forEach(function(globalGame) {
                if (globalGame.id === this.gameId) {
                    $.get('/api/v1/level/' + globalGame.levelId, function (res) {
                        this.lvl = res;
                        comHandle.connect(host, "4001", handleMessage, this.gameId, joinId);
                        // server sends start-msg, hence no callback needed here
                    });
                }
            })
        });
    }

    connectLocalGame(mode, comHandle, cb) {
        $.post('/api/v1/game', {type: this.lvlType.toUpperCase(), level: this.levelId, mode: mode, local: true, name: ""}, function(res) {
            let gameId = res.gameId;
            $.get('/api/v1/game/' + gameId, function(res) {
                let joinId1 = res.joinId;
                $.get('/api/v1/game/' + gameId, function(res) {
                    let joinId2 = res.joinId;
                    comHandle.connect(host, "4001", handleMessage, gameId, joinId1);
                    this.gameId = gameId;
                    this.joinIds.push(joinId1);
                    this.joinIds.push(joinId2);
                    if (cb !== undefined)       // auto-start on register in localMP, manual start in localSP
                        cb();
                });
            });
        });
        $.get('/api/v1/level/' + this.levelId, function (res) {
            this.lvl = res;
        });
    }

    retrieveLevel(levelId) {
        $.get('/api/v1/level', function (availLvls) {
            availLvls.forEach(function (availLvl) {
                if (availLvl._id === levelId) {
                    console.log('Retrieved Level:', availLvl);
                    if (availLvl.subtype === 'king')
                        DisplayController.disableBeatableWithKings();
                    DisplayController.updateModalTexts(availLvl.name, availLvl.description);
                    this.lvl = availLvl;
                }
            });
        });
    }

    getSubsequentLevel(cb) {
        $.get('/api/v1/level', function(lvls) {
            let idx = lvls.findIndex(x => x._id==this.lvl._id);
            if (lvls[idx + 1] === undefined || lvls[idx + 1].type !== this.lvl.type || lvls[idx + 1].subtype !== this.lvl.subtype) {
                cb(undefined);
            } else {
                cb(lvls[idx + 1]._id);
            }
        });
    }
}