var thiz = null;        // only used in onClick() ... thank goodness

class GameEngine {
    constructor(w, h, operationMode, anchor, global) {
        this.width = w;
        this.height = h;
        this.gameType = operationMode;
        this.parent = anchor;
        this.figureSize = figureSize = this.width / 8;
        this.renderer = null;
        this.stage = null;
        this.background = null;
        this.turn = playerType.PLAYERONE;
        this.player = playerType.PLAYERONE;
        this.global = global;
        this.figures = [];
        this.selectionHandler = null;
        thiz = this;
    }

    init(callback) {
        this.renderer = new PIXI.CanvasRenderer(this.width, this.height);
        this.parent.appendChild(this.renderer.view);
        this.stage = new PIXI.Container();
        this.selectionHandler = new SelectionHandler(this, this.gameType, this.stage);
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
    }

    createFigure(x, y, size, color, type) {
        let figure = new Figure(x, y, size, color);
        switch (type) {
            case "ROOK":
                if (color == playerType.PLAYERTWO) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/RookBlue.png"].texture), this.stage);
                } else if (color == playerType.PLAYERONE) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/RookYellow.png"].texture), this.stage);
                }
                break;
            case "KNIGHT":
                if (color == playerType.PLAYERTWO) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/KnightBlue.png"].texture), this.stage);
                } else if (color == playerType.PLAYERONE) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/KnightYellow.png"].texture), this.stage);
                }
                break;
            case "BISHOP":
                if (color == playerType.PLAYERTWO) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/BishopBlue.png"].texture), this.stage);
                } else if (color == playerType.PLAYERONE) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/BishopYellow.png"].texture), this.stage);
                }
                break;
            case "QUEEN":
                if (color == playerType.PLAYERTWO) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/QueenBlue.png"].texture), this.stage);
                } else if (color == playerType.PLAYERONE) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/QueenYellow.png"].texture), this.stage);
                }
                break;
            case "KING":
                if (color == playerType.PLAYERTWO) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/KingBlue.png"].texture), this.stage);
                } else if (color == playerType.PLAYERONE) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/KingYellow.png"].texture), this.stage);
                }
                break;
            case "PAWN":
                if (color == playerType.PLAYERTWO) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/PawnBlue.png"].texture), this.stage);
                } else if (color == playerType.PLAYERONE) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/PawnYellow.png"].texture), this.stage);
                }
                break;
            case "CHIP":
                figure.chip = true;
                if (color == playerType.PLAYERONE) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/ChipYellow.png"].texture), this.stage);
                } else if (color == playerType.PLAYERTWO) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/ChipBlue.png"].texture), this.stage);
                } else if (color == playerType.BOTH) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/ChipGreen.png"].texture), this.stage);
                } else if (color == playerType.NONE) {
                    figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/ChipRed.png"].texture), this.stage);
                }
                break;
            default:
                console.log('Invalid figure type!');
                break;
        }
        this.figures.push(figure);
        this.render();
    }

    loadLevel(level, callback) {
        //Background
        this.background = new PIXI.Sprite(PIXI.loader.resources["/img/board.png"].texture);
        this.background.width = this.width;
        this.background.height = this.height;
        this.background.interactive = true;
        this.background.on('mousedown', onClick);
        this.background.on('touchstart', onClick);
        this.stage.addChild(this.background);

        //level
        for (let i = 0; i < level.board.length; i++) {
            let cur = level.board[i];
            this.createFigure(cur.x, cur.y, this.figureSize, cur.color, cur.type);
        }
        if (callback != undefined)
            callback();
    }

    clear() {
        if(this.stage != null)
            this.stage.destroy();
        if(this.renderer!= null)
            this.renderer.destroy();
        if (this.moveCallback != null)
            this.moveCallback = null;
        this.turn = 0;
        PIXI.loader.reset();
    }

    switchTurn() {
        this.turn = (this.turn == playerType.PLAYERONE) ? playerType.PLAYERTWO : playerType.PLAYERONE;
        this.selectionHandler.nextTurn(this.turn);
    }

    setMoveCallback(callback) {
        this.moveCallback = callback;
    }

    setPlayer(player) {
        this.player = player;
        //this.turn = player;
    }

    render() {
        this.renderer.render(this.stage);
    }

    moveFigure(origX, origY, destX, destY) {
        if (origX == destX && origY == destY)
            return;
        let figure = Helper.getFigure(origX, origY, this.figures);
        let other = Helper.getFigure(destX, destY, this.figures);

        if (other != null) {
            this.selectionHandler.removeSelection(other.x, other.y);
            other.destroy();
        }
        figure.move(destX, destY);
        this.selectionHandler.move(destX, destY);
        if (this.gameType != gameType.SP) {       // if not singleplayer
            this.switchTurn();
            // this.rotateBoard();
        }
        this.render();
    }

    onClick(rawX, rawY) {
        let pos = Helper.getPos(rawX, rawY);
        //console.log('Clicked: (' + pos.x + '|' + pos.y + ')');

        if(this.global && this.turn != this.player)
            return;

        if(this.selectionHandler.select(pos.x, pos.y)) {
            let lastSelection = this.selectionHandler.getLastSelection();

            if(this.moveCallback != null) {
                this.moveCallback(lastSelection.x, lastSelection.y, pos.x, pos.y);
            } else {
                this.moveFigure(lastSelection.x, lastSelection.y, pos.x, pos.y);
            }
        }
    }

    /*rotateBoard() {
        for(let i = 0; i < figureList.length; i++) {
            figure.position.x = this.calcPosX(9 - (figure.position.x / this.sprSize + 1));
            figure.position.y = this.calcPosY(9 - (figure.position.y / this.sprSize + 1));
        }
        this.render();
    }*/
}

//Wrapper Method for PIXI
function onClick(e) {
    thiz.onClick(e.data.global.x - PixiEngine.stage.getGlobalPosition().x, e.data.global.y - PixiEngine.stage.getGlobalPosition().y);
}

class Helper {
    constructor() {}

    static getPixelPos(x, y) {
        return {
            x: figureSize * (x - 1),
            y: figureSize * (y - 1)
        };
    }

    static getPos(pixelX, pixelY) {
        return {
            x: Math.floor(pixelX / figureSize) + 1,
            y: Math.floor(pixelY / figureSize) + 1
        };
    }

    static getFigure(x, y, figureList) {
        for(let i = 0; i < figureList.length; i++) {
            if(figureList[i].x == x && figureList[i].y == y)
                return figureList[i];
        }
        return null;
    }
}

class SelectionHandler {
    constructor(parent, gameType, stage) {
        this.parent = parent;
        this.gameType = gameType;
        this.turn = playerType.PLAYERONE;
        this.selections = [
            new Selection(0,0),
            new Selection(0,0)
        ];
        this.stage = stage;
        this.graphics = null;
    }

    select(x, y) {
        let select = this.selections[this.turn];
        if(!select.active) {
            //console.log('New field selected: (' + x + '|' + y + ')' );
            let figure = Helper.getFigure(x, y, this.parent.figures);
            if(figure != null && !figure.chip && figure.color == this.turn) {
                select.setSelection(x, y);
                this.switchGraphic(false, x, y);
            }
            return false;
        } else {
            if(x == select.x && y == select.y) {
                this.removeSelection(x, y);
                return false;
            }
            return true;
        }
    }

    move(x, y) {
        this.selections[this.turn].x = x;
        this.selections[this.turn].y = y;
        this.switchGraphic(false, x, y);
    }

    switchGraphic(removeFlag, x, y) {
        if(this.graphics != null) {
            this.graphics.destroy();
            this.graphics = null;
        }
        if(removeFlag) {
            this.parent.render();
            return;
        }
        this.graphics = new PIXI.Graphics();
        let pos = Helper.getPixelPos(x, y);
        this.graphics.beginFill(0x00FF00);
        this.graphics.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.graphics.alpha = 0.5;
        this.graphics.drawRect(pos.x, pos.y, figureSize, figureSize);
        this.stage.addChild(this.graphics);
        this.parent.render();
    }

    removeSelection(x, y) {
        for(let i = 0; i < this.selections.length; i++) {
            if(this.selections[i].x != x || this.selections[i].y != y) {
                continue;
            } else {
                this.selections[i].x = this.selections[i].y = 0;
                this.selections[i].active = false;
                this.switchGraphic(true, 0, 0);
            }
        }
    }

    getLastSelection() {
        return {
            x: this.selections[this.turn].x,
            y: this.selections[this.turn].y
        };
    }

    nextTurn(turn) {
        this.turn = turn;
        if(turn != this.parent.player && this.parent.global)
            return;
        this.switchGraphic(false, this.selections[turn].x, this.selections[turn].y);
    }
}

class Selection {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.active = false;
    }

    setSelection(x, y) {
        this.active = true;
        this.x = x;
        this.y = y;
    }

    enable() {}
    disable(){}
}

class Figure {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.chip = false;
        this.sprite = null;
    }

    destroy() { //ToDo Remove from figures list
        this.x = -99;
        this.y = -99;
        this.sprite.destroy();
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        let pos = Helper.getPixelPos(this.x, this.y);
        this.sprite.position.x = pos.x;
        this.sprite.position.y = pos.y;
    }

    setSprite(spr, stage) {
        this.sprite = spr;
        let pos = Helper.getPixelPos(this.x, this.y);
        this.sprite.position.x = pos.x;
        this.sprite.position.y = pos.y;
        this.sprite.height = this.sprite.width = this.size;
        stage.addChild(this.sprite);
    }
}

class EditorEngine extends GameEngine {
    constructor(wh, anchor) {
        super(wh, wh, gameType.SP, anchor, false);
        this.selection= null;
    }

    init(cb) {
        let emptyLevel = {
            id: '',
            name: '',
            description: '',
            board: [],
            type: '',
            subtype: '',
            minturns: 0
        };
        super.init(function() {
            cb();
        });
    }

    loadLevel(cb) {
        let emptyLevel = {
            id: '',
            name: '',
            description: '',
            board: [],
            type: '',
            subtype: '',
            minturns: 0
        };
        super.loadLevel(emptyLevel, cb);
    }

    createFigure(x, y, color, type) {
        super.createFigure(x, y, this.figureSize, color, type);
    }

    onClick(rawX, rawY) {
        let pos = Helper.getPos(rawX, rawY);
        console.log('Clicked: (' + pos.x + '|' + pos.y + ')');

        let figure = Helper.getFigure(pos.x, pos.y, this.figures);
        if(figure != null) {
            figure.destroy();
            super.render();
        }

        if (this.selection != null) {
            this.createFigure(pos.x, pos.y, this.selection.color, this.selection.type);
            console.log('Created '+this.selection.type+'_'+this.selection.color+' at ['+pos.x+','+pos.y+'].');
        }
    }
}