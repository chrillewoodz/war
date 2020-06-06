import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Session } from './interfaces';

@Injectable({
  providedIn: 'root'
})

export class GameCache {

  private emitter = new ReplaySubject(1);
  public emitter$ = this.emitter.asObservable();

  constructor() {}

  get clientId() {
    return sessionStorage.getItem('clientId');
  }

  get sessionId() {
    return sessionStorage.getItem('sessionId');
  }

  get session() {
    return JSON.parse(sessionStorage.getItem('session'));
  }

  setClientId(id: string) {
    sessionStorage.setItem('clientId', id);
  }

  setSessionId(id: string) {
    sessionStorage.setItem('sessionId', id);
  }

  setSession(session: Session) {
    sessionStorage.setItem('session', JSON.stringify(session));
  }
}