import { Injectable } from '@angular/core';
// import { Headers, Http } from '@angular/http';
// import { $WebSocket } from 'angular2-websocket/angular2-websocket';

import 'rxjs';
import * as Rx from 'rxjs/Rx.js';

@Injectable()
export class WebSocketService {
	// private ws = new $WebSocket('ws://127.0.0.1:4001/')
    //
	// constructor(private http:Http) {
    //
	// 	// set received message callback
	// 	this.ws.onMessage(
	// 		(msg: MessageEvent)=> {
	// 			console.log("onMessage ", msg.data);
	// 		},
	// 		{autoApply: false}
	// 	);
    //
	// }
    //
	// send(msg:string) {
	// 	this.ws.send("some thing").subscribe(
	// 		(msg:any)=> {
	// 			console.log("next", msg.data);
	// 		},
	// 		(msg:any)=> {
	// 			console.log("error", msg);
	// 		},
	// 		()=> {
	// 			console.log("complete");
	// 		}
	// 	);
	// }

    private socket: Rx.Subject<MessageEvent>;

    public connect(url:string): Rx.Subject<MessageEvent> {
        if(!this.socket) {
            this.socket = this.create(url);
        }
        return this.socket;
    }

    private create(url:string): Rx.Subject<MessageEvent> {
        let ws = new WebSocket(url);
        let observable = Rx.Observable.create(
            (obs: Rx.Observer<MessageEvent>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);
                return ws.close.bind(ws);
            }
        );
        let observer = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            },
        };
        return Rx.Subject.create(observer, observable);
    }
	
}