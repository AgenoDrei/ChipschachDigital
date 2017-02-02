var opMode = {
    SP: 0,
    MP: 1,
}

var PixiEngine = {
    height: 800,
    width: 800,
    sprSize: this.width / 8,
    sprList: [],
    stage: null,
    renderer: null,
    selectedField: null,
    background: null,
    moveCallback: null,     // params: {x, y, newX, newY}
    turn: 0,
    operationMode: opMode.SP,

    init: function(w, h, operationMode, anchor, callback) {
        this.height = h;
        this.width = w;
        this.operationMode = operationMode,
        this.sprSize = this.width / 8;
        this.renderer = new PIXI.CanvasRenderer(this.width, this.height);
        anchor.appendChild(this.renderer.view);
        this.stage = new PIXI.Container();
        var level = null;
        PIXI.loader
            .add("/img/board.png")
            .add("/img/BishopBlue.png")
            .add("/img/BishopYellow.png")
            .add("/img/ChipBlue.png")
            .add("/img/ChipYellow.png")
            .add("/img/ChipGreen.png")
            .add("/img/ChipRed.png")
            .add("/img/KingBlue.png")
            .add("/img/KingYellow.png")
            .add("/img/KnightBlue.png")
            .add("/img/KnightYellow.png")
            .add("/img/PawnBlue.png")
            .add("/img/PawnYellow.png")
            .add("/img/QueenBlue.png")
            .add("/img/QueenYellow.png")
            .add("/img/RookBlue.png")
            .add("/img/RookYellow.png")
            .load(callback);

    },

    destroy: function() {
        if(this.stage != null)
            this.stage.destroy();
        if(this.renderer!= null)
            this.renderer.destroy();
        if (this.moveCallback != null)
            this.moveCallback = null;
        this.turn = 0;
        PIXI.loader.reset();
    },

    switchTurn: function() {
        if(this.turn == 0) {
            this.turn = 1;
        } else {
            this.turn = 0;
        }
    },

    setMoveCallback: function(callback) {
        this.moveCallback = callback;
    },

    moveFigure: function(origX, origY, destX, destY) {
        if(origX == destX && origY == destY) {
            return;
        }
        var figure = this.getFigure(origX, origY);

        if((other = this.getFigure(destX, destY)) != null) {
            other.position.x = -99;
            other.position.y = -99;
        }
        figure.position.x = this.calcPosX(destX);
        figure.position.y = this.calcPosY(destY);
        if (this.operationMode != opMode.SP) {       // if not singleplayer
            this.switchTurn();
            // this.rotateBoard();
        }
        this.render();
    },

    switchSelection: function(x, y) {
        if(this.selectedField == null) {
            var graphics = new PIXI.Graphics();
            graphics.beginFill(0x00FF00);
            graphics.alpha = 0.5;
            graphics.blendMode = PIXI.BLEND_MODES.MULTIPLY;
            graphics.drawRect(this.calcPosX(x), this.calcPosX(y), this.sprSize, this.sprSize);
            this.selectedField = graphics;
            this.selectedField.pos = {};
            this.selectedField.pos.x = x;
            this.selectedField.pos.y = y;
            this.stage.addChild(graphics);
        } else if(this.selectedField != null) {
            var tmp = this.selectedField.pos;
            this.selectedField.destroy();
            this.selectedField = null;
            if(tmp.x != x || tmp.y != y)
                switchSelection(x,y);
        }
        this.render();
    },

    getFigure: function(x, y) {
        var realX = this.sprSize * (x-1);
        var realY = this.sprSize * (y-1);

        for(var key in this.sprList) {
            var figure = this.sprList[key];
            if(figure.position._x == realX && figure.position._y == realY) {
                return figure;
            }
        }
        return null;
    },

    render: function() {
        this.renderer.render(this.stage);
    },

    calcPosX: function(x) {
        return this.sprSize * (x - 1);
    },

    calcPosY: function(y) {
        return this.sprSize * (y - 1);
    },

    onClick: function(e) {
        var rawX = e.data.global.x - PixiEngine.stage.getGlobalPosition().x;
        var rawY = e.data.global.y - PixiEngine.stage.getGlobalPosition().y;
        var x = Math.floor(rawX / PixiEngine.sprSize) + 1;
        var y = Math.floor(rawY / PixiEngine.sprSize) + 1;

        //console.log('Clicked: (' + x + '|' + y + ')');

        if(PixiEngine.selectedField == null  && PixiEngine.getFigure(x,y) != null) {
            var figure = PixiEngine.getFigure(x, y);
            if(PixiEngine.turn != figure.color) {
                return;
            }
            PixiEngine.switchSelection(x, y);
            return;
        }
        if(PixiEngine.selectedField != null && PixiEngine.selectedField.pos.x == x && PixiEngine.selectedField.pos.y == y) {
            PixiEngine.switchSelection(x,y);
            return;
        }
        if(PixiEngine.selectedField != null) { 
            if(PixiEngine.moveCallback != null) 
                PixiEngine.moveCallback(PixiEngine.selectedField.pos.x, PixiEngine.selectedField.pos.y, x, y);
            else 
                PixiEngine.moveFigure(PixiEngine.selectedField.pos.x, PixiEngine.selectedField.pos.y, x, y);
            PixiEngine.switchSelection(PixiEngine.selectedField.pos.x, PixiEngine.selectedField.pos.y);
            return;
        }
    },  


    rotateBoard: function() {
        for(figureKey in this.sprList) {
            var figure = this.sprList[figureKey];
            figure.position.x = this.calcPosX(9 - (figure.position.x/this.sprSize +1));
            figure.position.y = this.calcPosY(9 - (figure.position.y/this.sprSize +1));
        }
        this.render();
    },

    clearBoard: function() {
        for(figureKey in this.sprList) {
            var figure = this.sprList[figureKey];
            figure.destroy();
        }
        this.render();
    },

    loadLevel: function(level, callback) {
        //Background
        background = new PIXI.Sprite(PIXI.loader.resources["/img/board.png"].texture);
        background.width = this.width;
        background.height = this.height;
        background.interactive = true;
        background.on('mousedown', this.onClick);
        background.on('touchstart', this.onClick);

        this.stage.addChild(background);

        //level
        for (var i = 0; i < level.board.length; i++) {
            var cur = level.board[i]
            var figure = null;
            switch (cur.type) {
                case "ROOK":
                    if (cur.color == 1) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/RookBlue.png"].texture);
                    } else if (cur.color == 0) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/RookYellow.png"].texture);
                    }
                    break;
                case "KNIGHT":
                    if (cur.color == 1) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/KnightBlue.png"].texture);
                    } else if (cur.color == 0) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/KnightYellow.png"].texture);
                    }
                    break;
                case "BISHOP":
                    if (cur.color == 1) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/BishopBlue.png"].texture);
                    } else if (cur.color == 0) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/BishopYellow.png"].texture);
                    }
                    break;
                case "QUEEN":
                    if (cur.color == 1) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/QueenBlue.png"].texture);
                    } else if (cur.color == 0) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/QueenYellow.png"].texture);
                    }
                    break;
                case "KING":
                    if (cur.color == 1) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/KingBlue.png"].texture);
                    } else if (cur.color == 0) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/KingYellow.png"].texture);
                    }
                    break;
                case "PAWN":
                    if (cur.color == 1) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/PawnBlue.png"].texture);
                    } else if (cur.color == 0) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/PawnYellow.png"].texture);
                    }
                    break;    
                case "CHIP":
                    if (cur.color == 0) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/ChipYellow.png"].texture);
                    } else if (cur.color == 1) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/ChipBlue.png"].texture);
                    } else if (cur.color == 2) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/ChipGreen.png"].texture);
                    } else if (cur.color == 3) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["/img/ChipRed.png"].texture);
                    }
                    break;
                default:
                    break;
            }
            if (figure != null) {
                figure.position.x = this.calcPosX(cur.x);
                figure.position.y = this.calcPosX(cur.y);
                figure.width = figure.height = this.sprSize;
                figure.color = cur.color;
                this.sprList.push(figure);
                this.stage.addChild(figure);
            }
        }

        callback();
    }
}