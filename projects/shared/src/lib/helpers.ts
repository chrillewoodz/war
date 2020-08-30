import { GameCache } from './game.cache';
import { GameConfig } from './game.config';
import { SocketResponse, Session, PipeResult, Area, Army, Armies } from './interfaces';
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

export function isMyTurnFromCache(cache: GameCache) {
  return cache.clientId === cache.session?.state.currentTurn?.clientId;
}

export function isMyTurnFromSession(session: Session, clientId: string) {
  return clientId === session?.state.currentTurn?.clientId;
}

export function isOccupiedByMe(result: PipeResult, area: Area) {
  return area.state.occupiedBy?.clientId === result.self.clientId;
}

export function isAreaOwnedByMe(clientId: string, area: Area) {
  return area.state.occupiedBy?.clientId === clientId;
}

export function getSelectedAreaFromResult(result: PipeResult): Area {
  return result.session.state.map.areas.find((area) => area.state.isSelected === true && area.state.isConnectedToSelected === false);
}

export function getSelectedConnectionFromResult(result: PipeResult): Area {
  return result.session.state.map.areas.find((area) => area.state.isSelected === true && area.state.isConnectedToSelected === true);
}

export function getTotalPowerOfArea(area: Area) {

  if (!area) {
    return null;
  }

  const totalPower = Object.keys(area.state.armies)
    .filter((k) => k !== 'spies') // Do not take spies into consideration
    .map((k) => ({key: k, army: area.state.armies[k]}))
    .reduce((total, current) => {
      return total += current.army.amount * (GameConfig.armyTypes[current.key] as Army).power;
    }, 0);

  return totalPower;
}

export function getTotalArmiesInArea(area: Area, excludeSpies = false) {

  const totalAmount = Object.keys(area?.state.armies)
    .filter((k) => excludeSpies ? k !== 'spies' : true)
    .map((k) => ({key: k, army: area.state.armies[k]}))
    .reduce((total, current) => {
      return total += current.army.amount;
    }, 0);

  return totalAmount;
}

export function getTotalArmiesExcludingSpiesInArea(area: Area) {

  const totalAmount = Object.keys(area?.state.armies)
    .map((k) => ({key: k, army: area.state.armies[k]}))
    .reduce((total, current) => {
      return total += current.army.amount;
    }, 0);

  return totalAmount;
}

export function getTotalArmiesFromState(armies: Armies) {

  const totalAmount = Object.keys(armies)
    .map((k) => ({key: k, army: armies[k]}))
    .reduce((total, current) => {
      return total += current.army.amount;
    }, 0);

  return totalAmount;
}

export function findAndReplace(areas: Area[], areaToReplaceWith: Area) {
  const _areas = [...areas];
  const i = _areas.findIndex((area) => area.areaId === areaToReplaceWith.areaId);
  _areas[i] = areaToReplaceWith;
  return _areas;
}