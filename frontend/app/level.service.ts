import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LevelService {
	private levelsUrl = '/api/v1/level'

	constructor(private http:Http) {}

	getLevelIDs():Promise<Level[]> {
		return this.http.get(this.levelsUrl)
			.toPromise()
			.then(res => res.json() as Level[])
			.catch(this.handleError);
	}

	typeLevelIDs(allAvails:Level[]):LvlDeclTypedList {
		// init empty return typedList & pseudo-callback-counter
		var typedLevels:LvlDeclTypedList = {
			sp: {
				pawn: [],
				knight: [],
				bishop: [],
				rook: [],
				queen: [],
				king: []
			},
			mp: {
				pawn: [],
				knight: [],
				bishop: [],
				rook: [],
				queen: [],
				king: []
			},
			mini: {
				pawn: [],
				knight: [],
				bishop: [],
				rook: [],
				queen: [],
				king: []
			}
		};
		var counter:number = 0;
		
		// sort all available levels into types as well as subtypes
		for (let lvl of allAvails) {
			for (let type in typedLevels)		// loop all types
				if (typedLevels.hasOwnProperty(type) && type === lvl.type)		// type found
					// typedLevels[type]['pawn'].push(lvl);
					for (let subtype in typedLevels[type])		// loop all subtypes
						if (typedLevels[type].hasOwnProperty(subtype) && subtype === lvl.subtype)		// subtype found
							typedLevels[type][subtype].push(lvl);

			counter++;
			if(counter == allAvails.length){
				// clean result s.t. empty subtype-lists are deleted
				for (let type in typedLevels)
					for (let subtype in typedLevels[type])
						if (typedLevels[type][subtype].length === 0)
							delete typedLevels[type][subtype];
				console.log('Level retrieved and sorted by types:');
				console.log(typedLevels);
				return typedLevels;
			}
		}
	}

	getLevel(id:String):Promise<Level> {
		return this.http.get(this.levelsUrl + '/' + id)
			.toPromise()
			.then(res => res.json())
			.catch(this.handleError);
	}

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}
}