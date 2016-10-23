import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
declare var $:JQueryStatic;

@Component({
    selector: 'multiplayer-global',
    templateUrl: 'app/views/playground.html',
    styleUrls: ['app/styles/playground.css', 'app/styles/simple-sidebar.css']
})
export class MultiGlobalComponent implements AfterViewInit {
	@ViewChild('menuModal') el:ElementRef;
	menuToggled:Boolean = false;

	ngAfterViewInit() {
		// $("#menuModal").modal();
		// $(this.el.nativeElement).modal();
	}
}