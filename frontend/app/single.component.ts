import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import {LevelService} from './level.service';
import {WebSocketService} from './websocket.service';

declare var PixiGameEngineJS:any;

@Component({
    selector: 'singleplayer',
    templateUrl: 'app/views/playgroundSingle.html',
    styleUrls: ['app/styles/playground.css', 'app/styles/simple-sidebar.css'],
    providers: [LevelService, WebSocketService]
})
export class SingleComponent  implements OnInit {
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
		private lvlService: LevelService,
		private socketService: WebSocketService
	) {}

	ngOnInit() {
	  	this.route.params
	    	.switchMap((params: Params) => this.lvlService.getLevel(params['id']))
			.subscribe((lvl:Level) => this.initPixi(this.lvl = lvl, this.setMoveCallback(this.socketService)));
	}

	initPixi(lvl:Level, callback:any):void {
		console.log('Level: ', lvl);
		PixiGameEngineJS.destroy();
		PixiGameEngineJS.init(600, 600, 0, document.getElementById('board-anchor'), function() {
			PixiGameEngineJS.loadLevel(lvl, function() {
				PixiGameEngineJS.render();
				callback();
			});
		});
	}

	setMoveCallback(socketService:WebSocketService) {
		PixiGameEngineJS.setMoveCallback(function(origX:number, origY:number, destX:number, destY:number) {
			
		})
	}
}