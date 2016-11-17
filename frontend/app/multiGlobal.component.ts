import {Component} from '@angular/core';

@Component({
    selector: 'multiplayer-global',
    templateUrl: 'app/views/playground.html',
    styleUrls: ['app/styles/playground.css', 'app/styles/simple-sidebar.css']
})
export class MultiGlobalComponent {
	levelStarted:Boolean = false;
	menuToggled:Boolean = false;

	
}