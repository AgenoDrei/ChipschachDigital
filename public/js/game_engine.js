/**
 * Created by simon on 11.03.17.
 */

var thiz = null;

class GameEngine {
    constructor(w, h, operationMode, anchor) {
        this.width = w;
        this.height = h;
        this.gameType = operationMode;
        this.parent = anchor;
        this.figureSize = this.width / 8;
        this.renderer = null;
        this.stage = null;
        this.background = null;
        this.turn = playerType.PLAYERONE;
        this.figures = [];
        this.selectionHandler = new SelectionHandler(this.gameType);
        thiz = this;
    }

    init(callback) {
        this.renderer = new PIXI.CanvasRenderer(this.width, this.height);
        this.parent.appendChild(this.renderer.view);
        this.stage = new PIXI.Container();
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
            let figure = new Figure(cur.x, cur.y, this.figureSize, cur.color);
            switch (cur.type) {
                case "ROOK":
                    if (cur.color == playerType.PLAYERTWO) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/RookBlue.png"].texture), this.stage);
                    } else if (cur.color == playerType.PLAYERONE) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/RookYellow.png"].texture), this.stage);
                    }
                    break;
                case "KNIGHT":
                    if (cur.color == playerType.PLAYERTWO) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/KnightBlue.png"].texture), this.stage);
                    } else if (cur.color == playerType.PLAYERONE) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/KnightYellow.png"].texture), this.stage);
                    }
                    break;
                case "BISHOP":
                    if (cur.color == playerType.PLAYERTWO) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/BishopBlue.png"].texture), this.stage);
                    } else if (cur.color == playerType.PLAYERONE) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/BishopYellow.png"].texture), this.stage);
                    }
                    break;
                case "QUEEN":
                    if (cur.color == playerType.PLAYERTWO) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/QueenBlue.png"].texture), this.stage);
                    } else if (cur.color == playerType.PLAYERONE) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/QueenYellow.png"].texture), this.stage);
                    }
                    break;
                case "KING":
                    if (cur.color == playerType.PLAYERTWO) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/KingBlue.png"].texture), this.stage);
                    } else if (cur.color == playerType.PLAYERONE) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/KingYellow.png"].texture), this.stage);
                    }
                    break;
                case "PAWN":
                    if (cur.color == playerType.PLAYERTWO) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/PawnBlue.png"].texture), this.stage);
                    } else if (cur.color == playerType.PLAYERONE) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/PawnYellow.png"].texture), this.stage);
                    }
                    break;
                case "CHIP":
                    if (cur.color == playerType.PLAYERONE) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/ChipYellow.png"].texture), this.stage);
                    } else if (cur.color == playerType.PLAYERTWO) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/ChipBlue.png"].texture), this.stage);
                    } else if (cur.color == playerType.BOTH) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/ChipGreen.png"].texture), this.stage);
                    } else if (cur.color == playerType.NONE) {
                        figure.setSprite(new PIXI.Sprite(PIXI.loader.resources["/img/ChipRed.png"].texture), this.stage);
                    }
                    break;
                default:
                    break;
            }
            this.figures.push(figure);
        }
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

    render() {
        this.renderer.render(this.stage);
    }

    moveFigure(origX, origY, destX, destY) {
        if (origX == destX && origY == destY)
            return;
        var figure = Helper.getFigure(origX, origY, this.figures);
        var other = Helper.getFigure(destX, destY, this.figures);

        if (other != null) {
            other.destroy();
        }
        figure.move(destX, destY);
        if (this.operationMode != gameType.SP) {       // if not singleplayer
            this.switchTurn();
            // this.rotateBoard();
        }
        this.render();
    }

    onClick(rawX, rawY) {
        let pos = Helper.getPos(rawX, rawY, this.figureSize);
        console.log('Clicked: (' + pos.x + '|' + pos.y + ')');

        if(this.selectionHandler.select(pos.x, pos.y)) {
            let lastSelection = this.selectionHandler.getLastSelection();
            this.moveFigure(lastSelection.x, lastSelection.y, pos.x, pos.y);
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

    static getPixelPos(x, y, figureSize) {
        return {
            x: figureSize * (x - 1),
            y: figureSize * (y - 1)
        };
    }

    static getPos(pixelX, pixelY, figureSize) {
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
    constructor(gameType) {
        this.gameType = gameType;
        this.turn = playerType.PLAYERONE;
        this.selections = [
            new Selection(0,0),
            new Selection(0,0)
        ];
    }

    select(x, y) {
        let select = this.selections[this.turn];
        if(!select.active) {
            select.setSelection(x, y);
            return false;
        } else {
            if(x == select.x && y == select.y) {
                select.active = false;
                return false;
            }
            return true;
        }
    }

    getLastSelection() {
        return {
            x: this.selections[this.turn].x,
            y: this.selections[this.turn].y
        };
    }

    nextTurn(turn) {
        this.selections[this.turn].disable();
        this.turn = turn;
        this.selections[turn].enable();

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

    destroy() {
        this.x = -99;
        this.y = -99;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        let pos = Helper.getPixelPos(this.x, this.y, this.size);
        this.sprite.position.x = pos.x;
        this.sprite.position.y = pos.y;
    }

    setSprite(spr, stage) {
        this.sprite = spr;
        let pos = Helper.getPixelPos(this.x, this.y, this.size);
        this.sprite.position.x = pos.x;
        this.sprite.position.y = pos.y;
        this.sprite.height = this.sprite.width = this.size;
        stage.addChild(this.sprite);
    }
}