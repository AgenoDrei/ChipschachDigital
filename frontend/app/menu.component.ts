import {Component, OnInit} from '@angular/core';

import {LevelService} from './level.service';

@Component({
    selector: 'menu',
    templateUrl: 'app/views/menu.html',
    styleUrls: ['app/styles/menu.css'],
    providers: [LevelService]
})
export class MenuComponent implements OnInit {
	public spLevels:Level[];
	public mpLevels:Level[];
	public miniLevels:Level[];
	public classicLevels:Level[];
	
	constructor(private levelService:LevelService) {}

	ngOnInit():void {
		this.levelService.getLevelIDs()
			.then(function(allAvails) {
				allAvails.forEach(function(lvl) {
					
				})
			});

		this.levelService.getLevel('mp_pawn_1_1').then(res => console.log(res));
	}
}