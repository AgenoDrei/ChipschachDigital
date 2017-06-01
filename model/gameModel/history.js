const helper = require('../helper');

class History {
    constructor(board) {
        this.board = board;
        this.lastPosition = {
            x: -1,
            y: -1,
            newX: -1,
            newY: -1
        };
        this.beatFigure = null;
        this.movedFigure = null;
    }

    setLastMove(destX, destY, movedFigure) {
        this.lastPosition.x = movedFigure.x;
        this.lastPosition.y = movedFigure.y;
        this.lastPosition.newX = destX;
        this.lastPosition.newY = destY;
        this.movedFigure = movedFigure;

        console.log('Saved last move: ', this.lastPosition);
    }

    setLastBeat(beatFigure) {
        this.beatFigure = beatFigure;
    }

    undo() {
        if(this.lastPosition.x == -1)
            return {move: {type: 'error', msg: 'Undo not possible'}};

        if(this.beatFigure != null && this.beatFigure.x == this.lastPosition.newX && this.beatFigure.y == this.lastPosition.newY) {
            this.board.getField(this.movedFigure.x, this.movedFigure.y).setFigure(this.beatFigure);
            debugger;
            if(this.beatFigure.constructor.name.toUpperCase() == 'CHIP') {
                this.board.parentGame.win.chips[this.beatFigure.player]++;
                this.board.parentGame.win.score[this.movedFigure.player]--;
            }
        } else
            this.board.getField(this.movedFigure.x, this.movedFigure.y).setFigure(null);

        this.board.getField(this.lastPosition.x, this.lastPosition.y).setFigure(this.movedFigure);
        this.movedFigure.x = this.lastPosition.x;
        this.movedFigure.y = this.lastPosition.y;

        return this.createClientUndo();
    }

    //ToDo: Remove beat information after one turn

    createClientUndo() {
        let moveMessage = null,
            recreateMessage = null;

        moveMessage = {
            type: "undo",
            player: this.movedFigure.player,
            origX: this.lastPosition.newX,
            origY: this.lastPosition.newY,
            destX: this.lastPosition.x,
            destY: this.lastPosition.y
        };

        if(this.beatFigure != null && this.beatFigure.x == this.lastPosition.newX && this.beatFigure.y == this.lastPosition.newY) {
            recreateMessage = {
                type: "figure",
                x: this.beatFigure.x,
                y: this.beatFigure.y,
                color: this.beatFigure.player,
                figureType: this.beatFigure.constructor.name.toUpperCase()
            };
        }
        this.clear();

        return {move: moveMessage, recreate: recreateMessage};
    }

    clear() {
        this.lastPosition.x = this.lastPosition.y = this.lastPosition.newX = this.lastPosition.newY = -1;
        this.beatFigure = this.movedFigure = null;
    }
}

module.exports = History;