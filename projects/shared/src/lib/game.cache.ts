import { ReplaySubject } from 'rxjs';
import { Injectable, ViewContainerRef } from '@angular/core';
import { Session } from './interfaces';

export enum CacheKey {
  ClientID = 'clientId',
  SessionID = 'sessionId',
  Session = 'session'
}

export enum CacheAction {
  Set = 'set',
  Remove = 'remove'
}

interface StoredEvent {
  key: CacheKey;
  action: CacheAction;
}

@Injectable({
  providedIn: 'root'
})

export class GameCache {

  private emitter = new ReplaySubject<StoredEvent>(1);

  public emitter$ = this.emitter.asObservable();

  private _mapElement: SVGSVGElement;
  private _outcomeViewContainerRef: ViewContainerRef;

  constructor() {}

  get clientId() {
    return sessionStorage.getItem(CacheKey.ClientID);
  }

  get sessionId() {
    return sessionStorage.getItem(CacheKey.SessionID);
  }

  get session(): Session {
    return JSON.parse(sessionStorage.getItem(CacheKey.Session));
  }

  get self() {
    const session: Session = JSON.parse(sessionStorage.getItem(CacheKey.Session));
    return session.state.players[this.clientId];
  }

  get mapElement() {
    return this._mapElement;
  }

  get outcomeViewContainerRef() {
    return this._outcomeViewContainerRef;
  }

  getAreaById(areaId: string) {
    const session: Session = JSON.parse(sessionStorage.getItem(CacheKey.Session));
    return session.state.areas.find((area) => area.areaId === areaId);
  }

  getSelectedArea() {
    const session: Session = JSON.parse(sessionStorage.getItem(CacheKey.Session));
    return session.state.areas.find((area) => area.state.isSelected === true && area.state.isConnectedToSelected === false);
  }

  getSelectedConnectedArea() {
    const session: Session = JSON.parse(sessionStorage.getItem(CacheKey.Session));
    return session.state.areas.find((area) => area.state.isSelected === true && area.state.isConnectedToSelected === true);
  }

  setClientId(id: string) {
    sessionStorage.setItem(CacheKey.ClientID, id);
    this.emitter.next({ key: CacheKey.ClientID, action: CacheAction.Set });
  }

  setSessionId(id: string) {
    sessionStorage.setItem(CacheKey.SessionID, id);
    this.emitter.next({ key: CacheKey.SessionID, action: CacheAction.Set });
  }

  setSession(session: Session) {
    sessionStorage.setItem(CacheKey.Session, JSON.stringify(session));
    this.emitter.next({ key: CacheKey.Session, action: CacheAction.Set });
  }

  setMapElement(mapElement: SVGSVGElement) {
    this._mapElement = mapElement;
  }

  setOutcomeHost(outcomeViewContainerRef: ViewContainerRef) {
    this._outcomeViewContainerRef = outcomeViewContainerRef;
  }

  removeSessionId() {
    sessionStorage.removeItem(CacheKey.SessionID);
    this.emitter.next({ key: CacheKey.SessionID, action: CacheAction.Remove });
  }

  removeSession() {
    sessionStorage.removeItem(CacheKey.Session);
    this.emitter.next({ key: CacheKey.Session, action: CacheAction.Remove });
  }
}