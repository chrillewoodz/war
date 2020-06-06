
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GameCache } from './game.cache';
import { Action } from './enums';
import { exhaust } from './helpers';
import config from './game.config.json';
import { SocketApi } from './socket.api';

export enum GameEngineEvent {
  Start,
  Ready
}

@Injectable({
  providedIn: 'root'
})

export class GameEngine {

  private start = new ReplaySubject<boolean>(1);
  private start$ = this.start.asObservable();
  private ready = new ReplaySubject<boolean>(1);
  private ready$ = this.ready.asObservable();

  constructor(private cache: GameCache, private socketApi: SocketApi) {

    // for (let i = 0; i < 26; i++) {
    //   console.log('greater', `26 vs ${i}`, this.getWinPercentage(26, i));
    // }

    // for (let i = 26; i > 0; i--) {
    //   console.log('lesser', `${i} vs 26`, this.getWinPercentage(i, 26));
    // }
  }

  listen(event: GameEngineEvent) {

    switch(event) {
      case GameEngineEvent.Start: return this.start$;
      case GameEngineEvent.Ready: return this.ready$;
      default: exhaust(event);
    }
  }

  setReadyState(state: boolean) {
    this.ready.next(state);
  }

  startGame() {

    this.socketApi.preUpdate(true, {
      started: true
    })
    .subscribe(() => {
      this.start.next(true);
    })
  }

  doAction(action: Action) {

    switch (action) {
      case Action.Attack: return this.attack();
      case Action.Deploy: return this.deploy();
      case Action.Relocate: return this.relocate();
      case Action.Spy: return this.spy();
      default: exhaust(action);
    }
  }

  private attack() {

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
      case 0: return config.negativeFightModifier;
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
        return b + config.fightModifier;
      }

      // If less, give the 1.5% modifier to the defender instead
      return b + -config.fightModifier;
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