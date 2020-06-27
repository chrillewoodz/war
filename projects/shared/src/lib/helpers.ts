import { SocketResponse, Session, PipeResult, Area } from './interfaces';
import { throwError, Observable, ObservableInput } from 'rxjs';

export function exhaust(p: never) {};

export function checkSocketEventResponse(ev: SocketResponse) {

  const evObservable = new Observable<SocketResponse>((observer) => observer.next(ev));

  switch (ev.status) {
    case 500: return throwError(ev.err);
    default: return evObservable;
  }
}

export function getLastPlayerWhoJoined(session: Session) {
  return Object.keys(session.state.players)
    .map((id) => session.state.players[id])
    .pop();
}

export function isMyTurn(result: PipeResult) {
  return result.self?.clientId === result.session?.state.currentTurn?.clientId;
}

export function isOccupiedByMe(result: PipeResult, area: Area) {
  return area.state.occupiedBy?.clientId === result.self.clientId;
}