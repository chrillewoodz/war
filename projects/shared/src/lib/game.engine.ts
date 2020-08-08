import { MapEngine } from './map.engine';
import { OutcomeComponent } from './outcome/outcome.component';
import { OutcomeApi } from './outcome/outcome.api';
import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { ReplaySubject, of, Observable } from 'rxjs';

import { SessionState, PipeResult, ActionEvent, Armies, Area, Session, Army } from './interfaces';
import { GameCache } from './game.cache';
import { Action } from './enums';
import { exhaust } from './helpers';
import { GameConfig } from './game.config';
import { SocketApi } from './socket.api';

export enum GameEngineEvent {
  Stop
}

interface ArmiesToDeploy {
  soldiers: number;
  horses: number;
  gatlingGuns: number;
  spies: number;
}

@Injectable({
  providedIn: 'root'
})

export class GameEngine {

  private stop = new ReplaySubject<boolean>(1);
  private stop$ = this.stop.asObservable();

  constructor(
    private cache: GameCache,
    private mapEngine: MapEngine,
    private socketApi: SocketApi,
    private outcomeApi: OutcomeApi
  ) {

    // for (let i = 0; i < 26; i++) {
    //   console.log('greater', `26 vs ${i}`, this.getWinPercentage(26, i));
    // }

    // for (let i = 26; i > 0; i--) {
    //   console.log('lesser', `${i} vs 26`, this.getWinPercentage(i, 26));
    // }
  }

  // setStartingArmies(result: PipeResult) {

  //   for (const clientId in result.session.state.players) {
  //     const idle = result.session.state.players[clientId].state.idle;
  //     idle.soldiers.amount = 10;
  //     idle.horses.amount = 4;
  //     idle.gatlingGuns.amount = 2;
  //     idle.soldiers.amount = 4;
  //   }

  //   return result;
  // }

  listen(event: GameEngineEvent) {

    switch(event) {
      case GameEngineEvent.Stop: return this.stop$;
      default: exhaust(event);
    }
  }

  stopGame() {
    this.stop.next(true);
  }

  setReadyState() {
    this.socketApi.ready(true);
  }

  updateGame(state: Partial<SessionState>) {
    return this.socketApi.update(true, state);
  }

  gameEnded() {
    this.stop.next(true);
  }

  doAction(action: Action, areaId: string): Observable<ActionEvent> {

    switch (action) {
      case Action.Attack: return this.attack(areaId);
      case Action.Deploy: return this.deploy(areaId);
      case Action.Relocate: return this.relocate(areaId);
      case Action.Spy: return this.spy(areaId);
      default: exhaust(action);
    }
  }

  private attack(areaId: string) {

    // const updatedAreas = this.cache.session.state.areas.map((area) => {

    //   if (area.areaId === areaId) {

    //     if (area.state.occupiedBy === null || area.state.occupiedBy === undefined) {
    //       area.state.occupiedBy = this.cache.session.state.players[this.cache.clientId];
    //     }
    //   }

    //   return area;
    // })

    return of({
      areaId,
      armies: this.cache.getSelectedArea().state.armies as Armies
    });
  }

  private deploy(areaId: string) {

    return of({
      areaId,
      armies: this.cache.self.state.idle
    });
  }

  private relocate(areaId: string) {

    return of({
      areaId,
      armies: this.cache.getSelectedArea().state.armies as Armies
    });
  }

  private spy(areaId: string) {

    return of({
      areaId,
      armies: this.cache.self.state.idle
    });
  }

  deployConfirmed(count: ArmiesToDeploy) {

    const session = this.cache.session;
    const self = this.cache.self;
    const selectedArea = this.cache.getSelectedArea();

    // Deselect area
    this.resetAreaAndConnections(selectedArea, session);

    // Add armies to area state
    selectedArea.state.armies.soldiers.amount += count.soldiers;
    selectedArea.state.armies.horses.amount += count.horses;
    selectedArea.state.armies.gatlingGuns.amount += count.gatlingGuns;
    selectedArea.state.armies.spies.amount += count.spies;

    // Negate armies from idle armies
    self.state.idle.soldiers.amount -= count.soldiers;
    self.state.idle.horses.amount -= count.horses;
    self.state.idle.gatlingGuns.amount -= count.gatlingGuns;
    self.state.idle.spies.amount -= count.spies;

    const areas = session.state.areas;
    const i = areas.findIndex((area) => area.areaId === selectedArea.areaId);

    areas[i] = selectedArea;

    return this.updateGame({
      areas,
      players: {
        ...session.state.players,
        [self.clientId]: self
      }
    });
  }

  spyConfirmed(count: Pick<ArmiesToDeploy, 'spies'>) {

    const session = this.cache.session;
    const self = this.cache.self;
    const selectedArea = this.cache.getSelectedArea();
    const selectedConnection = this.cache.getSelectedConnectedArea();

    // Deselect area
    this.resetAreaAndConnections(selectedArea, session);

    // TODO: Calculate success rate based on army value in selectedConnection
    // If win - add spiedOnBy in selectedConnection
    // If lose - do not add spiedOnBy in selectedConnection and negate the spy from selectedArea

    const successRate = this.getSpySuccessRate(selectedConnection.state.armies);
    const roll = Math.floor(Math.random() * 100);
    console.log(successRate);

    // if (roll <= successRate) {
    //   console.log('successful!')
    //   // Negate armies from the owned selected area
    //   selectedConnection.state.spiedOnBy[self.clientId] = self;
    // }
    // else {
      console.log('dead!')
      // this.outcomeApi.show({});
      this.mapEngine.loadOutcome();
      // Set area as spied on by self
      // selectedArea.state.armies.spies.amount -= count.spies;
    // }

    // Update the selectedArea and selectedConnection with the changes
    const areas = session.state.areas;
    const i = areas.findIndex((area) => area.areaId === selectedArea.areaId);
    const j = areas.findIndex((area) => area.areaId === selectedConnection.areaId);

    areas[i] = selectedArea;
    areas[j] = selectedConnection;

    return this.updateGame({
      areas,
      players: {
        ...session.state.players,
        [self.clientId]: self
      }
    });
  }

  private resetAreaAndConnections(selectedArea: Area, session: Session) {

    selectedArea.state.isSelected = false;

    // Resets all connections
    session.state.areas.forEach((area) => {

      if (selectedArea.areaId !== area.areaId) {
        area.state.isActive = false;
        area.state.isConnectedToSelected = false;
      }
    });
  }

  private get winModifier() {

    // 1/5 chance of getting a -10% modifier for the attack
    const roll = Math.floor(Math.random() * 5);

    switch (roll) {
      case 0: return GameConfig.negativeFightModifier;
      default: return 0;
    }
  }

  private getSpySuccessRate(troopsInArea: Armies) {

    const base = 95;
    const negatorPerArmy = 7.5;

    const totalArmies = Object.keys(troopsInArea)
      .filter((k) => k !== 'spies') // Do not take spies into consideration
      .map((k) => troopsInArea[k] as Army)
      .reduce((total, armyType) => {
        return total += armyType.amount;
      }, 0);

    return base - (totalArmies * negatorPerArmy);
  }

  /**
   * base 50% +1.5% / -1.5%
   * diffAsPercentage x% (compare troops)
   * randomModifier +0% / -10%
   *
   * @param attackerTroops
   * @param defenderTroops
   */
  private getWinPercentage(attackerTroops: number, defenderTroops: number) {

    const diff = attackerTroops - defenderTroops;
    const base = (() => {

      const b = 50;

      // If attacker has more or equal amount of troops, gain 1.5% chance to win
      if (diff >= 0) {
        return b + GameConfig.fightModifier;
      }

      // If less, give the 1.5% modifier to the defender instead
      return b + -GameConfig.fightModifier;
    })();

    const diffAsPercentage = (() => {

      if (diff >= 0) {
        return 100 - ((defenderTroops / attackerTroops) * 100);
      }

      return -(100 - ((attackerTroops / defenderTroops) * 100));
    })() / 2;

    return base + diffAsPercentage + this.winModifier;
  }
}