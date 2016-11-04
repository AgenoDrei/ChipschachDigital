interface LevelDeclaration {
	_id: String,
	description: String
}

interface Level {
    _id: string,
    type: string,
    // board: Figure[],
    board: Object[],
    name: string,
    description: string
}

interface Figure {
	type: string,
	color: string,
	x: number,
	y: number
}