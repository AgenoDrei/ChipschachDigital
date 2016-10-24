import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LevelService {
	private levelUrl = 'https://localhost:3000/api/v1/level'

	constructor(private http:Http) {}

	getLevelIDs():Promise<String[]> {
		return this.http.get(this.levelUrl)
			.toPromise()
			.then(res => res.json())
			.catch(this.handleError);
	}

	private handleError(error: any): Promise<any> {
		console.error('An error occurred', error); // for demo purposes only
		return Promise.reject(error.message || error);
	}
}