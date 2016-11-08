import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LevelService {
	private levelsUrl = '/api/v1/level'

	constructor(private http:Http) {}

	getLevelIDs():Promise<LevelDeclaration[]> {	
		console.log('calling getLevelIDs');
		return this.http.get(this.levelsUrl)
			.toPromise()
			.then(res => res.json() as LevelDeclaration[])
			.catch(this.handleError);
	}

	typeLevelIDs(allAvails:LevelDeclaration[]):LvlDeclTypedList {
		// init empty return typedList & pseudo-callback-counter
		var typedLevels:LvlDeclTypedList = {
			'sp': [],
			'mp': [],
			'mini': []
		};
		var counter:number = 0;
		
		// sort all available levels into types as well as subtypes
		for (let lvl of allAvails) {
			for (let type in typedLevels) {
				if (typedLevels.hasOwnProperty(type) && type === lvl.type) {
					typedLevels[type].push(lvl);
				}
			}


			counter++;
			if(counter == allAvails.length){
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