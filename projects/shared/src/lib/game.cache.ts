import { Injectable } from '@angular/core';
import { Session } from './interfaces';

@Injectable({
  providedIn: 'root'
})

export class GameCache {

  private readonly clientIdKey = 'clientId';
  private readonly sessionIdKey = 'sessionId';
  private readonly sessionKey = 'session';
  private readonly initDoneKey = 'initDone';

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

  get initDone(): boolean {
    return JSON.parse(sessionStorage.getItem(this.initDoneKey));
  }

  get self() {
    const session: Session = JSON.parse(sessionStorage.getItem(this.sessionKey));
    return session.state.players[this.clientId];
  }

  getAreaById(areaId: string) {
    const session: Session = JSON.parse(sessionStorage.getItem(this.sessionKey));
    return session.state.areas.find((area) => area.areaId === areaId);
  }

  getSelectedArea() {
    const session: Session = JSON.parse(sessionStorage.getItem(this.sessionKey));
    return session.state.areas.find((area) => area.state.isSelected === true);
  }

  getSelectedConnectedArea() {
    const session: Session = JSON.parse(sessionStorage.getItem(this.sessionKey));
    return session.state.areas.find((area) => area.state.isSelected === true && area.state.isConnectedToSelected === true);
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

  setInitDone() {
    sessionStorage.setItem(this.initDoneKey, JSON.stringify(true));
  }

  removeSessionId() {
    sessionStorage.removeItem(this.sessionIdKey);
  }

  removeSession() {
    sessionStorage.removeItem(this.sessionKey);
  }

  removeInitDone() {
    sessionStorage.removeItem(this.initDoneKey);
  }
}