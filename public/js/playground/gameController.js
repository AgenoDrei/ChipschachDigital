class GameController {
    constructor(pathnamesplit) {
        this.lvlType = pathnamesplit[1];
        this.lvlSubtype = this.lvlType === 'global' ? undefined : pathnamesplit[2];
        this.gameId = this.lvlType === 'global' ? pathnamesplit[2] : undefined;
        this.levelId = this.lvlType === 'global' ? undefined : pathnamesplit[3];
        this.joinIds = [];
        this.lvl = undefined;

        let thiz = this;

        if (this.lvlType === 'sp')
            this.connectLocalGame('unbeatable', this.joinIds, comHandle, function(gameId) {
                thiz.gameId = gameId;
            });
        // mp-local is calling connectLocalGame after mode-radio-check from playground
        // mp-global is calling connectGlobalGame upon receiving start msg from server

        if (this.lvlType !== 'global')
            this.retrieveLevel(this.levelId, function(lvl) {
                thiz.lvl = lvl;
            });
    }

    connectLocalGame(mode, joinIds, comHandle, handleGameIdCb) {
        $.post('/api/v1/game', {type: this.lvlType.toUpperCase(), level: this.levelId, mode: mode, local: true, name: ""}, function(res) {
            let gameId = res.gameId;
            $.get('/api/v1/game/' + gameId, function(res) {
                joinIds.push(res.joinId);
                $.get('/api/v1/game/' + gameId, function(res) {
                    joinIds.push(res.joinId);
                    comHandle.connect(host, "4001", handleMessage, gameId, joinIds[0]);
                    handleGameIdCb(gameId);
                });
            });
        });
    }

    connectGlobalGame(joinId, comHandle, cb) {
        let thiz = this;
        this.joinIds.push(joinId);       // already joined in menu
        $.get('/api/v1/game', function(globalGames) {
            globalGames.forEach(function(globalGame) {
                if (globalGame.id === thiz.gameId) {
                    thiz.retrieveLevel(globalGame.levelId, function(lvl) {
                        thiz.lvl = lvl;
                    });
                    comHandle.connect(host, "4001", handleMessage, thiz.gameId, joinId);
                    cb();
                    // server sends start-msg, started via playground.js
                }
            })
        });
    }

    retrieveLevel(levelId, cb) {
        $.get('/api/v1/level/' + levelId, function (lvl) {
            console.log('Retrieved Level:', lvl);
            if (lvl.subtype === 'king')
                DisplayController.disableBeatableWithKings();
            DisplayController.updateModalTexts(lvl.name, lvl.description);
            cb(lvl);
        });
    }

    getSubsequentLevel(cb) {
        let currentLvl = this.lvl;
        $.get('/api/v1/level', function(lvls) {
            let idx = lvls.findIndex(x => x._id==currentLvl._id);
            if (lvls[idx + 1] === undefined || lvls[idx + 1].type !== currentLvl.type || lvls[idx + 1].subtype !== currentLvl.subtype) {
                cb(undefined);
            } else {
                cb(lvls[idx + 1]._id);
            }
        });
    }
}