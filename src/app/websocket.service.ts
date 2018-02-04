import { Injectable } from '@angular/core';
import * as Rx from 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { webSocket } from 'rxjs/observable/dom/webSocket';


@Injectable()
export class WebsocketService {
  ws: WebSocket;

  createObservableSocket(url: string): Observable<string> {
    this.ws = new WebSocket(url);

    return new Observable(observer => {
      this.ws.onmessage = (event) => observer.next(JSON.parse(event.data));
      this.ws.onerror = (event) => observer.error(event);
      this.ws.onclose = (event) => observer.complete();
    });
  }

  sendMessage(message: string) {
    this.ws.send(message);
  }

  close(): void {
    this.ws.close();
  }

  constructor() { }
}
