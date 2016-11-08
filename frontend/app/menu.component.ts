import {Component, OnInit} from '@angular/core';

import {LevelService} from './level.service';

export enum LevelType {
	sp = 0,
	mp = 1,
	mini = 2
}
export enum LevelSubtype {
	pawn = 0,
	knight = 1,
	bishop = 2,
	rook = 3,
	queen = 4,
	king = 5
}

@Component({
    selector: 'menu',
    templateUrl: 'app/views/menu.html',
    styleUrls: ['app/styles/menu.css'],
    providers: [LevelService]
})
export class MenuComponent implements OnInit {
	allAvailLvls:LvlDeclTypedList;

	constructor(private levelService:LevelService) {}

	ngOnInit():void {
		this.levelService.getLevelIDs()
			.then(res => this.allAvailLvls = this.levelService.typeLevelIDs(res));
			// .then(res => console.log(res));

		// this.levelService.getLevel('mp_pawn_1_1').then(res => console.log(res));
	}
}