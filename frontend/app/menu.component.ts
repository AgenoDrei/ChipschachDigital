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
			{id:'sp', picId:'single', name:'Einzelspieler', color:'white'},
			{id:'mp', picId:'multiLocal', name:'Lokaler Mehrspieler', color:'white'},
			{id:'mp_g', picId:'multiGlobal', name:'Globaler Mehrspieler', color:'purple'}
		],[
			{id:'mini', picId:'mini', name:'Minischach', color:'purple'},
			{id:'impressum', picId:'logoLg', name:'', color:'white'},
			{id:'classic', picId:'classic', name:'Klassisches Schach', color:'purple'}
		],[
			{id:'', picId:'', name:'', color:'purple'},
			{id:'editor', picId:'editor', name:'Editor', color:'purple'},
			{id:'', picId:'', name:'', color:'purple'}
		]
	];

	allAvailLvls:LvlDeclTypedList = {
		sp: {},
		mp: {},
		mini: {}
	};

	constructor(private service:LevelService) {
		this.service.getLevelIDs()
			.then(res => console.log('Level retrieved and sorted by types:', this.allAvailLvls = this.service.typeLevelIDs(res)));
	}

	getTypes() : Array<string> {
		return Object.keys(this.allAvailLvls);
	}
	getSubtypes(type:String) : Array<string> {
		return Object.keys(this.allAvailLvls[<string>type]);
	}
}