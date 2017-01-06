import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { $WebSocket } from 'angular2-websocket/angular2-websocket';

import 'rxjs';

@Injectable()
export class WebSocketService {
	private ws = new $WebSocket('ws://127.0.0.1:4001/')

	constructor(private http:Http) {

		// set received message callback
		this.ws.onMessage(
			(msg: MessageEvent)=> {
				console.log("onMessage ", msg.data);
			},
			{autoApply: false}
		);

	}

	sentStuff(msg:string) {
		this.ws.send("some thing").subscribe(
			(msg:any)=> {
				console.log("next", msg.data);
			},
			(msg:any)=> {
				console.log("error", msg);
			},
			()=> {
				console.log("complete");
			}
		);
	}

	

	
}