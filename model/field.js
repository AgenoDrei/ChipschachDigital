class Field {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.figure = null;
		//console.log('New field at (' + x + '|' + y + ') created!');
	}

	getFigure() {
		return this.figure;
	}

	setFigure(figure) {
		this.figure = figure;
	}
}

module.exports = Field;