import {Component} from '@angular/core';

import {LevelService} from './level.service';

@Component({
    selector: 'menu',
    templateUrl: 'app/views/menu.html',
    styleUrls: ['app/styles/menu.css'],
    providers: [LevelService]
})
export class MenuComponent {
	dictIconNames:Object = {
		sp: 'Lokaler Einzelspieler',
		mp: 'Lokaler Mehrspieler',
		mini: 'Minischach-Aufgaben'
	}
	dictSubtypes:Object = {
		pawn: 'Bauer',
		knight: 'Springer',
		bishop: 'Läufer',
		rook: 'Turm',
		queen: 'Dame',
		king: 'König'
	}
	iconArrangement:Icon[][] = [
		[
			{id:'sp', picId:'single', name:'Einzelspieler'},
			{id:'mp', picId:'multiLocal', name:'Lokaler Mehrspieler'},
			{id:'mp_g', picId:'multiGlobal', name:'Globaler Mehrspieler'}
		],[
			{id:'mini', picId:'mini', name:'Minischach'},
			{id:'impressum', picId:'logoLg', name:''},
			{id:'classic', picId:'classic', name:'Klassisches Schach'}
		],[
			{id:'', picId:'', name:''},
			{id:'editor', picId:'editor', name:'Editor'},
			{id:'', picId:'', name:''}
		]
	];

	allAvailLvls:LvlDeclTypedList = {
		sp: {},
		mp: {},
		mini: {}
	};

	constructor(private service:LevelService) {
		this.service.getLevelIDs()
			.then(res => this.allAvailLvls = this.service.typeLevelIDs(res));
	}

	getTypes() : Array<string> {
		return Object.keys(this.allAvailLvls);
	}
	getSubtypes(type:String) : Array<string> {
		return Object.keys(this.allAvailLvls[<string>type]);
	}
}