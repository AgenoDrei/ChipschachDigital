interface LevelDeclaration {
	_id: String;
	description: String;
	type: String;		// sp, mp, mini
	subtype: String;		// pawn, knight, ...
}

interface LvlDeclTypedList {		// SP, MP & MINI fixed, adding each subtype as separate object
	sp: Object[];
	mp: Object[];
	mini: Object[];
	[key:string]: Object[];
}


/* Game Engine */

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