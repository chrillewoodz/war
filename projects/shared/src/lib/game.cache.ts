import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GameCache {

  private _sessionId: string;
  private _sessionState: any; // TODO: Type the state

  constructor() {}

  get sessionId() {
    return this._sessionId;
  }

  get sessionState() {
    return this._sessionState;
  }
}