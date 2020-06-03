import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GameCache {

  private _sessionState: any; // TODO: Type the state

  private emitter = new ReplaySubject(1);
  public emitter$ = this.emitter.asObservable();

  constructor() {}

  get clientId() {
    return localStorage.getItem('clientId');
  }

  get sessionId() {
    return localStorage.getItem('sessionId');
  }

  get sessionState() {
    return this._sessionState;
  }

  setClientId(id: string) {
    localStorage.setItem('clientId', id);
  }

  setSessionId(id: string) {
    localStorage.setItem('sessionId', id);
  }

  setSessionState(state: any) {
    this._sessionState = state;
  }
}