import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GameCache {

  private _sessionId: string;
  private _sessionState: any; // TODO: Type the state

  private emitter = new ReplaySubject(1);
  public emitter$ = this.emitter.asObservable();

  constructor() {}

  get sessionId() {
    return this._sessionId;
  }

  get sessionState() {
    return this._sessionState;
  }

  setSessionId(id: string) {
    this._sessionId = id;
  }

  setSessionState(state: any) {
    this._sessionState = state;
  }
}