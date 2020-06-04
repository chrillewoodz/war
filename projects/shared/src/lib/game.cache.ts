import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})

export class GameCache {

  private emitter = new ReplaySubject(1);
  public emitter$ = this.emitter.asObservable();

  constructor(private socket: Socket) {}

  get clientId() {
    return sessionStorage.getItem('clientId');
  }

  get sessionId() {
    return sessionStorage.getItem('sessionId');
  }

  setClientId(id: string) {
    sessionStorage.setItem('clientId', id);
  }

  setSessionId(id: string) {
    sessionStorage.setItem('sessionId', id);
  }
}