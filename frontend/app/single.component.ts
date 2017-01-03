import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import {LevelService} from './level.service';

declare var PixiGameEngineJS:any;

@Component({
    selector: 'singleplayer',
    templateUrl: 'app/views/playgroundSingle.html',
    styleUrls: ['app/styles/playground.css', 'app/styles/simple-sidebar.css'],
    providers: [LevelService]
})
export class SingleComponent  implements OnInit {
	public pixiEngine:any = PixiGameEngineJS;
	public lvl:Level;

	constructor (
		private route: ActivatedRoute,
		private router: Router,
		private service: LevelService
	) {
		// this.pixiEngine = new PixiEngine();
	}
	ngOnInit() {
	  	this.route.params
	    	.switchMap((params: Params) => this.service.getLevel(params['id']))
	    	.subscribe((lvl:Level) => this.initPixi(this.lvl = lvl));
	}


	initPixi(lvl:Level):void {
		console.log('Level: ', lvl);
		
		PixiGameEngineJS.destroy();
		PixiGameEngineJS.init(600, 600, document.getElementById('board-anchor'), function() {
			PixiGameEngineJS.loadLevel(lvl, function() {
				PixiGameEngineJS.render();
			});
		});

		// init (600, 600, document.body, function() {
		//     $.get("/api/v1/level/sp_rook_debug", function(data) {
		//         console.log('Level: ', data);
		//         loadLevel(data, function() {
		//             render();
		//         });
		//     });
	 	// });
	}
}