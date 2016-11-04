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
}

module.exports = Field;