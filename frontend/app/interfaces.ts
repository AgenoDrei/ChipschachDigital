interface Icon {
	id:String;
	picId:String;
	name:String;
	color?:String;
}


interface LvlDeclTypedList {		// SP, MP & MINI fixed, adding each subtype as separate object
	sp: SubtypedList;
	mp: SubtypedList;
	mini: SubtypedList;
	[key:string]: SubtypedList;
}

interface SubtypedList {
	pawn?: Level[];
	knight?: Level[];
	bishop?: Level[];
	rook?: Level[];
	queen?: Level[];
	king?: Level[];
	[key:string]: Level[];
}

interface Level {
    _id: string;
	type: String;		// sp, mp, mini
	subtype: String;		// pawn, knight, ...
    board?: Figure[];		// board optional in case of menu only laoding id & type
    name: string;
    description?: string;
}

interface Figure {
	type: string;
	color: number;
	x: number;
	y: number;
}