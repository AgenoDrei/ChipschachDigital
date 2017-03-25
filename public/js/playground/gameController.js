class GameController {
    constructor(pathnamesplit) {
        this.lvlType = pathnamesplit[1];
        this.lvlSubtype = this.lvlType === 'global' ? undefined : pathnamesplit[2];
        this.gameId = this.lvlType === 'global' ? pathnamesplit[2] : undefined;
        this.levelId = this.lvlType === 'global' ? undefined : pathnamesplit[3];
        this.joinIds = [];
        this.lvl = undefined;

        if (this.lvlType === 'sp')
            this.connectLocalGame('unbeatable', this.joinIds, comHandle, undefined);
        else if (this.lvlType === 'global')
            this.connectGlobalGame(window.location.href.split('=')[1], comHandle);

        if (this.lvlType !== 'global') {
            this.lvl = this.retrieveLevel(this.levelId);
        }
    }

    connectLocalGame(mode, joinIds, comHandle, cb) {
        $.post('/api/v1/game', {type: this.lvlType.toUpperCase(), level: this.levelId, mode: mode, local: true, name: ""}, function(res) {
            let gameId = res.gameId;
            $.get('/api/v1/game/' + gameId, function(res) {
                joinIds.push(res.joinId);
                $.get('/api/v1/game/' + gameId, function(res) {
                    joinIds.push(res.joinId);
                    this.gameId = gameId;
                    comHandle.connect(host, "4001", handleMessage, gameId, joinIds[0]);
                    if (cb !== undefined)       // auto-start on register in localMP, manual start in localSP
                        cb();
                });
            });
        });
    }

    connectGlobalGame(joinId, comHandle) {
        this.joinIds.push(joinId);       // already joined in menu
        $.get('/api/v1/game', function(globalGames) {
            globalGames.forEach(function(globalGame) {
                if (globalGame.id === this.gameId) {
                    this.lvl = this.retrieveLevel(globalGame.levelId);
                    comHandle.connect(host, "4001", handleMessage, this.gameId, joinId);
                    // server sends start-msg, hence no callback needed here
                }
            })
        });
    }

    retrieveLevel(levelId) {
        $.get('/api/v1/level/' + levelId, function (lvl) {
            console.log('Retrieved Level:', lvl);
            if (lvl.subtype === 'king')
                DisplayController.disableBeatableWithKings();
            DisplayController.updateModalTexts(lvl.name, lvl.description);
            return lvl;
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