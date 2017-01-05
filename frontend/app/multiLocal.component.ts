import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import {LevelService} from './level.service';

declare var PixiGameEngineJS:any;

@Component({
    selector: 'multiplayer-local',
    templateUrl: 'app/views/playgroundMulti.html',
    styleUrls: ['app/styles/playground.css', 'app/styles/simple-sidebar.css'],
    providers: [LevelService]
})
export class MultiLocalComponent  implements OnInit {
	public pixiEngine:any = PixiGameEngineJS;
	public lvl:Level = {
		_id: 'dummy',
		type: 'sp',
		subtype: 'dummy',
		name: 'dummy',
		description: 'dummy'
	};

	constructor (
		private route: ActivatedRoute,
		private router: Router,
		private service: LevelService
	) {}

	ngOnInit() {
	  	this.route.params
	    	.switchMap((params: Params) => this.service.getLevel(params['id']))
	    	.subscribe((lvl:Level) => this.initPixi(this.lvl = lvl));
	}

	initPixi(lvl:Level):void {
		console.log('Level: ', lvl);
		
		PixiGameEngineJS.destroy();
		PixiGameEngineJS.init(600, 600, 1, document.getElementById('board-anchor'), function() {
			PixiGameEngineJS.loadLevel(lvl, function() {
				PixiGameEngineJS.render();
			});
		});
	}
}