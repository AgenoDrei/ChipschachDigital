var shortid = require('shortid');

class Game {
	constructor(type, mode, level) {
		this.type = type;
		this.mode = mode;
		this.level = level;
		this.id = shortid.generate();
		this.player1 = null;
		this.player2 = null;
		console.log('New Game created with ID: ', this.id);
	}

	getId() {
		return this.id;
	}
}

module.exports = Game;