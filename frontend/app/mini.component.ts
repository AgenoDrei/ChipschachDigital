import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import {LevelService} from './level.service';

@Component({
    selector: 'mini-chess',
    template: `<h2>Minischach WIP</h2>`,
    providers: [LevelService]
})
export class MiniComponent  implements OnInit {
	public lvl:Level;

	constructor (
		private route: ActivatedRoute,
		private router: Router,
		private service: LevelService
	) {}

	ngOnInit() {
	  	this.route.params
	    	.switchMap((params: Params) => this.service.getLevel(params['id']))
	    	.subscribe((lvl: Level) => console.log(this.lvl = lvl));
	}
}