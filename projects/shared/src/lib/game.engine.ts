import { MapEngine } from './map.engine';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { SessionState, PipeResult, Area } from './interfaces';
import { GameCache } from './game.cache';
import { Action } from './enums';
import { exhaust } from './helpers';
import { GameConfig } from './game.config';
import { SocketApi } from './socket.api';

export enum GameEngineEvent {
  Stop
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
    private socketApi: SocketApi
  ) {

    // for (let i = 0; i < 26; i++) {
    //   console.log('greater', `26 vs ${i}`, this.getWinPercentage(26, i));
    // }

    // for (let i = 26; i > 0; i--) {
    //   console.log('lesser', `${i} vs 26`, this.getWinPercentage(i, 26));
    // }
  }

  setStartingArmies(result: PipeResult) {

    for (const clientId in result.session.state.players) {

      result.session.state.players[clientId].state.armies = {
        soldiers: {
          ...GameConfig.armyTypes.soldier,
          amount: 10
        },
        horses: {
          ...GameConfig.armyTypes.horse,
          amount: 4
        },
        gatlingGuns: {
          ...GameConfig.armyTypes.gatlingGun,
          amount: 2
        },
        spies: {
          ...GameConfig.armyTypes.spy,
          amount: 2
        }
      }

      result.session.state.players[clientId].state.idle = {
        soldiers: {
          ...GameConfig.armyTypes.soldier,
          amount: 0
        },
        horses: {
          ...GameConfig.armyTypes.horse,
          amount: 0
        },
        gatlingGuns: {
          ...GameConfig.armyTypes.gatlingGun,
          amount: 0
        },
        spies: {
          ...GameConfig.armyTypes.spy,
          amount: 0
        }
      }

      // result.session.state.areas = result.session.state.areas.map((area) => {

      //   console.log(area.state)
      //   if (area.isStartingArea && area.state.occupiedBy.clientId === clientId) {
      //     area.state.armies = result.session.state.players[clientId].state.armies;
      //   }

      //   return area;
      // })
    }

    return result;
  }

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
    this.socketApi.update(true, state);
  }

  gameEnded() {
    this.stop.next(true);
  }

  doAction(action: Action, areaId: string) {

    switch (action) {
      case Action.Attack: return this.attack(areaId);
      case Action.Deploy: return this.deploy();
      case Action.Relocate: return this.relocate();
      case Action.Spy: return this.spy();
      default: exhaust(action);
    }
  }

  private attack(areaId: string) {

    const updatedAreas = this.cache.session.state.areas.map((area) => {

      if (area.areaId === areaId) {

        if (area.state.occupiedBy === null || area.state.occupiedBy === undefined) {
          area.state.occupiedBy = this.cache.session.state.players[this.cache.clientId];
        }
      }

      return area;
    })
  }

  private deploy() {

  }

  private relocate() {

  }

  private spy() {

  }

  private get winModifier() {

    // 1/5 chance of getting a -10% modifier for the attack
    const roll = Math.floor(Math.random() * 5);

    switch (roll) {
      case 0: return GameConfig.negativeFightModifier;
      default: return 0;
    }
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