import { Injectable } from '@angular/core';
import { Session } from './interfaces';

@Injectable({
  providedIn: 'root'
})

export class GameCache {

  private readonly clientIdKey = 'clientId';
  private readonly sessionIdKey = 'sessionId';
  private readonly sessionKey = 'session';

  constructor() {}

  get clientId() {
    return sessionStorage.getItem(this.clientIdKey);
  }

  get sessionId() {
    return sessionStorage.getItem(this.sessionIdKey);
  }

  get session(): Session {
    return JSON.parse(sessionStorage.getItem(this.sessionKey));
  }

  setClientId(id: string) {
    sessionStorage.setItem(this.clientIdKey, id);
  }

  setSessionId(id: string) {
    sessionStorage.setItem(this.sessionIdKey, id);
  }

  setSession(session: Session) {
    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  removeSessionId() {
    sessionStorage.removeItem(this.sessionIdKey);
  }

  removeSession() {
    sessionStorage.removeItem(this.sessionKey);
  }
}