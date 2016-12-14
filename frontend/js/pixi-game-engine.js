var PixiGameEngineJS = {
    height : 0,
    width : 0,
    sprSize : 0,    
    sprList : [],
    stage : null,
    renderer : null,
    selectedField : null,
    background : null,

    PixiEngine : function (w, h) {
        this.height = h,
        this.width = w,
        this.sprSize = w / 8
    },

    init: function(w, h, anchor, callback) {
        this.height = h;
        this.width = w;
        this.sprSize = width / 8;
        this.renderer = new PIXI.CanvasRenderer(width, height);
        anchor.appendChild(renderer.view);
        this.stage = new PIXI.Container();
        var level = null;
        PIXI.loader
            .add("../img/board.png")
            .add("../img/BishopBlue.png")
            .add("../img/BishopYellow.png")
            .add("../img/ChipBlue.png")
            .add("../img/ChipYellow.png")
            .add("../img/ChipGreen.png")
            .add("../img/ChipRed.png")
            .add("../img/KingBlue.png")
            .add("../img/KingYellow.png")
            .add("../img/KnightBlue.png")
            .add("../img/KnightYellow.png")
            .add("../img/PawnBlue.png")
            .add("../img/PawnYellow.png")
            .add("../img/QueenBlue.png")
            .add("../img/QueenYellow.png")
            .add("../img/RookBlue.png")
            .add("../img/RookYellow.png")
            .load(callback);
    },

    moveFigure: function(origX, origY, destX, destY) {
        var figure = getFigure(origX, origY);

        if((other = getFigure(destX, destY)) != null) {
            other.alpha = 0;
        }
        figure.position.x = this.this.calcPosX(destX);
        figure.position.y = calcPosY(destY);
        render();
    },

    switchSelection : function(x, y) {
        if (selectedField != null && selectedField.position.x == this.calcPosX(x) && selectedField.position.y == calcPosY(y)) {
            selectedField.alpha = 0;
            selectedField = null;
            render();
        } else if(selectedField == null) {
            var graphics = new PIXI.Graphics();
            selectedField = graphics;
            graphics.beginFill(0x00FF00);
            //graphics.lineStyle(2, 0x00AA00);
            graphics.alpha = 0.5;
            graphics.blendMode = PIXI.BLEND_MODES.MULTIPLY;
            graphics.drawRect(this.calcPosX(x), this.calcPosX(y), sprSize, sprSize);
            this.stage.addChild(graphics);
            render();
        } else {
            selectedField.position.x = this.calcPosX(x);
            selectedField.position.y = calcPosY(y);
            render();
        }
    },

    getFigure : function(x, y) {
        var realX = sprSize * (x-1);
        var realY = sprSize * (y-1);

        for(var key in this.sprList) {
            var figure = this.sprList[key];
            if(figure.position._x == realX && figure.position._y == realY) {
                return figure;
            }
        }
        return null;
    },

    render : function() {
        renderer.render(stage);
    },

    calcPosX : function(x) {
        return sprSize * (x - 1);
    },

    calcPosY : function(y) {
        return sprSize * (y - 1);
    },


    rotateBoard : function() {
        for(figureKey in this.sprList) {
            var figure = this.sprList[figureKey];
            figure.position.x = this.calcPosX(9 - (figure.position.x/sprSize +1));
            figure.position.y = this.calcPosY(9 - (figure.position.y/sprSize +1));
        }
        render();
    },

    clearBoard : function() {
        for(figureKey in this.sprList) {
            var figure = this.sprList[figureKey];
            figure.destroy();
        }
        render();
    },


    loadLevel : function(level, callback) {
        //Background
        background = new PIXI.Sprite(PIXI.loader.resources["../img/board.png"].texture);
        background.width = width;
        background.height = height;
        this.stage.addChild(background);

        //level
        for (var i = 0; i < level.board.length; i++) {
            var cur = level.board[i]
            var figure = null;
            switch (cur.type) {
                case "ROOK":
                    if (cur.color == 1) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["../img/RookBlue.png"].texture);
                    } else if (cur.color == 0) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["../img/RookYellow.png"].texture);
                    }
                    break;
                case "CHIP":
                    if (cur.color == 0) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["../img/ChipYellow.png"].texture);
                    } else if (cur.color == 1) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["../img/ChipBlue.png"].texture);
                    } else if (cur.color == 2) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["../img/ChipGreen.png"].texture);
                    } else if (cur.color == 3) {
                        figure = new PIXI.Sprite(PIXI.loader.resources["../img/ChipRed.png"].texture);
                    }
                    break;
                default:
                    break;
            }
            if (figure != null) {
                figure.position.x = this.calcPosX(cur.x);
                figure.position.y = this.calcPosX(cur.y);
                figure.width = figure.height = sprSize;
                this.sprList.push(figure);
                this.stage.addChild(figure);
            }
        }

        callback();
    }
};
