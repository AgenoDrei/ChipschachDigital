class GameController {
    constructor(lvlId, gameId) {
        this.gameId = gameId;
        this.joinIds = [];
        this.level = undefined;

        if (lvlId !== undefined)
            this.retrieveLevel(lvlId);

    }

    connectLocalGame(lvlType, lvlId, mode, joinIds) {
        $.post('/api/v1/game', {type: lvlType.toUpperCase(), level: lvlId, mode: mode, local: true, name: ""}, function(res) {
            // let gameId = res.gameId;
            this.gameId = res.gameId;
            $.get('/api/v1/game/' + this.gameId, function(res) {
                joinIds.push(res.joinId);
                $.get('/api/v1/game/' + this.gameId, function(res) {
                    joinIds.push(res.joinId);
                    comHandle.connect(null, null, handleMessage, this.gameId, joinIds[0]);
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }

    connectGlobalGame(joinId) {
        let thiz = this;
        this.joinIds.push(joinId);       // already joined in menu
        $.get('/api/v1/game', function(globalGames) {
            globalGames.forEach(function(globalGame) {
                if (globalGame.id === thiz.gameId) {
                    thiz.retrieveLevel(globalGame.levelId);
                    comHandle.connect(null, null, handleMessage, thiz.gameId, joinId);
                }
            }.bind(this));
        });
    }

    retrieveLevel(levelId) {
        $.get('/api/v1/level/' + levelId, function (lvl) {
            console.log('Retrieved Level:', lvl);
            if (lvl.subtype === 'king')
                DisplayController.disableBeatableWithKings();
            DisplayController.updateModalTexts(lvl.name[lang], lvl.description[lang], lvl.contact);
            this.level = lvl;
        }.bind(this));
    }

    getSubsequentLevel(cb) {
        $.get('/api/v1/level', function(lvls) {
            let idx = lvls.findIndex(x => x._id==this.level._id);
            if (lvls[idx + 1] === undefined || lvls[idx + 1].type !== this.level.type || lvls[idx + 1].subtype !== this.level.subtype) {
                cb(undefined);
            } else {
                cb(lvls[idx + 1]._id);
            }
        }.bind(this));
    }
}
