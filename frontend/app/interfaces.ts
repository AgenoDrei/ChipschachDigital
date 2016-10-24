interface Level {
    _id: string,
    type: string,
    board: Figure[],
    name: string,
    description: string
}

interface Figure {
	type: string,
	color: string,
	x: number,
	y: number
}