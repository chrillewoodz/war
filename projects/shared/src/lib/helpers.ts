import { factionsAsArray } from './factions';
import { SocketEvent } from './interfaces';
import { throwError, Observable } from 'rxjs';

export function exhaust(p: never) {};

export function checkSocketEventResponse(ev: SocketEvent) {

  const evObservable = new Observable<SocketEvent>((observer) => observer.next(ev));

  switch (ev.status) {
    case 500: return throwError(ev.err);
    default: return evObservable;
  }
}

export function attachFactions(session) {

  const _session = session;
  let i = 0;

  for (const player in _session.state.players) {
    const _player = { ..._session.state.players[player], faction: factionsAsArray[i] };
    _session.state.players[player] = _player;
    i++;
  }

  return _session;
}

export function getSelf(session, clientId: string) {

  for (const player in session.state.players) {

    if (player === clientId) {
      return session.state.players[player];
    }
  }
}