import { first, switchMap } from 'rxjs/operators';
import { MapEngine } from './map.engine';
import { Injectable } from '@angular/core';
import { ReplaySubject, of, Observable, timer } from 'rxjs';

import { SessionState, ActionEvent, Armies, Area, Army } from './interfaces';
import { GameCache } from './game.cache';
import { Action } from './enums';
import { exhaust } from './helpers';
import { GameConfig } from './game.config';
import { SocketApi } from './socket.api';
import { Bound } from './decorators';

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

  public isBlocked = false;

  private stop = new ReplaySubject<boolean>(1);
  private stop$ = this.stop.asObservable();

  constructor(
    private cache: GameCache,
    private mapEngine: MapEngine,
    // private socketApi: SocketApi
  ) {

    // for (let i = 0; i < 26; i++) {
    //   console.log('greater', `26 vs ${i}`, this.getArmiesLost(26, i));
    // }

    // for (let i = 26; i > 0; i--) {
    //   console.log('lesser', `${i} vs 26`, this.getArmiesLost(i, 26));
    // }
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

  gameEnded() {
    this.stop.next(true);
  }

  doAction(action: Action): Observable<ActionEvent> {

    switch (action) {
      case Action.Attack: return this.attack();
      case Action.Deploy: return this.deploy();
      case Action.Move: return this.move();
      case Action.Spy: return this.spy();
      default: exhaust(action);
    }
  }

  private attack() {

    return of({
      armies: this.cache.getSelectedArea().state.armies as Armies
    });
  }

  private deploy() {

    return of({
      armies: this.cache.self.state.idle
    });
  }

  private move() {

    return of({
      armies: this.cache.getSelectedArea().state.armies as Armies
    });
  }

  private spy() {

    return of({
      armies: this.cache.self.state.idle
    });
  }

  @Bound
  attackConfirmed(armies: ArmiesToDeploy) {

    const session = this.cache.session;
    const selectedArea = this.cache.getSelectedArea();
    const selectedConnection = this.cache.getSelectedConnectedArea();

    const attackerPower = Object.keys(armies)
      .filter((k) => k !== 'spies') // Do not take spies into consideration
      .map((k) => ({key: k, army: selectedArea.state.armies[k]}))
      .reduce((total, current) => {
        return total += current.army.amount * (GameConfig.armyTypes[current.key] as Army).power;
      }, 0);

    const defenderPower = Object.keys(selectedConnection.state.armies)
      .filter((k) => k !== 'spies') // Do not take spies into consideration
      .map((k) => ({key: k, army: selectedConnection.state.armies[k]}))
      .reduce((total, current) => {
        return total += current.army.amount * (GameConfig.armyTypes[current.key] as Army).power;
      }, 0);

    const successRate = this.getWinRate(attackerPower, defenderPower);
    const roll = Math.floor(Math.random() * 100);

    if (roll <= successRate) {

      const lostArmies = this.getArmiesLost(armies, attackerPower, defenderPower);

      // Negate armies from the owned selected area
      selectedArea.state.armies.soldiers.amount -= armies.soldiers;
      selectedArea.state.armies.horses.amount -= armies.horses;
      selectedArea.state.armies.gatlingGuns.amount -= armies.gatlingGuns;

      this.mapEngine.loadOutcome({
        image: 'assets/SVG/rifles-crossed.svg',
        title: {
          color: '#08c339',
          label: 'Success'
        },
        messages: [
          { color: 'white', label: 'Attack succeeded, at a cost..' },
          { color: '#08c339', label: `+1 soldiers recruited in new area` },
          { color: 'red', label: `-${lostArmies.soldiers} soldiers` },
          { color: 'red', label: `-${lostArmies.horses} horses` },
          { color: 'red', label: `-${lostArmies.gatlingGuns} gatlingGuns` }
        ]
      });

      // Set a new area owner
      selectedConnection.state.occupiedBy = selectedArea.state.occupiedBy;

      // Set the remaining attacking armies as the armies in the conquered area.
      // If no armies were left after the attack, the attacker will "recruit" 1 soldier army
      // in the new area, leaving the area with at least 1 army. (hence the +1)
      const soldiersLeft = armies.soldiers - lostArmies.soldiers + 1;
      const horsesLeft = armies.horses - lostArmies.horses;
      const gatlingGunsLeft = armies.gatlingGuns - lostArmies.gatlingGuns;

      selectedConnection.state.armies = {
        soldiers: {
          amount: soldiersLeft || 0
        },
        horses: {
          amount: horsesLeft || 0
        },
        gatlingGuns: {
          amount: gatlingGunsLeft || 0
        },
        spies: {
          amount: 0
        }
      };

      // Reset spiedOnBy since area has a new owner and armies
      selectedConnection.state.spiedOnBy = {};
    }
    else {

      // Negate armies from the attacking area
      selectedArea.state.armies.soldiers.amount -= armies.soldiers;
      selectedArea.state.armies.horses.amount -= armies.horses;
      selectedArea.state.armies.gatlingGuns.amount -= armies.gatlingGuns;

      this.mapEngine.loadOutcome({
        image: 'assets/SVG/human-skull.svg',
        title: {
          color: 'red',
          label: 'Killed'
        },
        messages: [
          { color: 'white', label: 'Attack failed' },
          { color: 'white', label: 'All armies were defeated' }
        ]
      });
    }

    // Update the selectedArea and selectedConnection with the changes
    let areas = session.state.areas;
    const i = areas.findIndex((area) => area.areaId === selectedArea.areaId);
    const j = areas.findIndex((area) => area.areaId === selectedConnection.areaId);

    areas[i] = selectedArea;
    areas[j] = selectedConnection;

    // Deselect areas
    areas = this.resetAreaAndConnections(areas);

    return of(areas);
    // return this.updateGame({
    //   areas
    // });
  }

  @Bound
  deployConfirmed(count: ArmiesToDeploy) {

    const session = this.cache.session;
    const self = this.cache.self;
    const selectedArea = this.cache.getSelectedArea();

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

    this.mapEngine.loadOutcome({
      image: 'assets/SVG/soldiers.svg',
      title: {
        color: '#08c339',
        label: 'Deployed'
      },
      messages: [
        { color: '#08c339', label: `+${count.soldiers} soldiers deployed` },
        { color: '#08c339', label: `+${count.horses} horses deployed` },
        { color: '#08c339', label: `+${count.gatlingGuns} gatling guns deployed` },
        { color: '#08c339', label: `+${count.spies} spies deployed` }
      ]
    });

    let areas = session.state.areas;
    const i = areas.findIndex((area) => area.areaId === selectedArea.areaId);

    areas[i] = selectedArea;

    // Deselect areas
    areas = this.resetAreaAndConnections(areas);

    return of(areas);
    // return this.updateGame({
    //   areas,
    //   players: {
    //     ...session.state.players,
    //     [self.clientId]: self
    //   }
    // });
  }

  @Bound
  moveConfirmed(count: ArmiesToDeploy) {

    const session = this.cache.session;
    const selectedArea = this.cache.getSelectedArea();
    const selectedConnection = this.cache.getSelectedConnectedArea();

    // Negate armies from selected area armies
    selectedArea.state.armies.soldiers.amount -= count.soldiers;
    selectedArea.state.armies.horses.amount -= count.horses;
    selectedArea.state.armies.gatlingGuns.amount -= count.gatlingGuns;
    selectedArea.state.armies.spies.amount -= count.spies;

    // Add armies to selected connection
    selectedConnection.state.armies.soldiers.amount += count.soldiers;
    selectedConnection.state.armies.horses.amount += count.horses;
    selectedConnection.state.armies.gatlingGuns.amount += count.gatlingGuns;
    selectedConnection.state.armies.spies.amount += count.spies;

    const messages = [];

    count.soldiers > 0 && messages.push({ color: 'white', label: `-${count.soldiers} soldiers` });
    count.horses > 0 && messages.push({ color: 'white', label: `-${count.horses} horses` });
    count.gatlingGuns > 0 && messages.push({ color: 'white', label: `-${count.gatlingGuns} gatling guns` });
    count.spies > 0 && messages.push({ color: 'white', label: `-${count.spies} spies` });

    const selectedAreaAnchorPoint = this.mapEngine.mapToScreenCoordinates(this.cache.mapElement, selectedArea.anchorPoints.main.x, selectedArea.anchorPoints.main.y);

    this.mapEngine.loadOutcome({
      image: 'assets/SVG/soldiers.svg',
      title: {
        color: '#08c339',
        label: `Armies moving to ${selectedConnection.name}...`
      },
      messages,
      x: selectedAreaAnchorPoint.x,
      y: selectedAreaAnchorPoint.y
    });

    return timer(GameConfig.outcomeAnimationLength)
      .pipe(
        first(),
        switchMap(() => {

          const messages = [];

          count.soldiers > 0 && messages.push({ color: 'white', label: `+${count.soldiers} soldiers` });
          count.horses > 0 && messages.push({ color: 'white', label: `+${count.horses} horses` });
          count.gatlingGuns > 0 && messages.push({ color: 'white', label: `+${count.gatlingGuns} gatling guns` });
          count.spies > 0 && messages.push({ color: 'white', label: `+${count.spies} spies` });

          this.mapEngine.loadOutcome({
            image: 'assets/SVG/soldiers.svg',
            title: {
              color: '#08c339',
              label: `Armies arrived from ${selectedArea.name}`
            },
            messages
          });

          let areas = session.state.areas;
          const i = areas.findIndex((area) => area.areaId === selectedArea.areaId);
          const j = areas.findIndex((area) => area.areaId === selectedConnection.areaId);

          areas[i] = selectedArea;
          areas[j] = selectedConnection;

          // Deselect areas
          areas = this.resetAreaAndConnections(areas);

          return of(areas);
          // return this.updateGame({
          //   areas
          // });
      })
    );
  }

  @Bound
  spyConfirmed(count: Pick<ArmiesToDeploy, 'spies'>) {

    if (!count) {
      throw new Error('Spy count was not defined, this indicates a bug that needs to be fixed.');
    }

    const session = this.cache.session;
    const self = this.cache.self;
    const selectedArea = this.cache.getSelectedArea();
    const selectedConnection = this.cache.getSelectedConnectedArea();
    const successRate = this.getSpySuccessRate(count.spies, selectedConnection.state.armies);
    const roll = Math.floor(Math.random() * 100);

    if (roll <= successRate) {

      // Set area as spied on by self
      selectedConnection.state.spiedOnBy[self.clientId] = self;

      this.mapEngine.loadOutcome({
        image: 'assets/SVG/spies.svg',
        title: {
          color: '#08c339',
          label: 'Success'
        },
        messages: [
          { color: 'white', label: 'Gained area intel' }
        ]
      });
    }
    else {

      // Negate armies from the owned selected area
      selectedArea.state.armies.spies.amount -= count.spies;

      this.mapEngine.loadOutcome({
        image: 'assets/SVG/human-skull.svg',
        title: {
          color: 'red',
          label: 'Killed'
        },
        messages: [
          { color: 'white', label: 'Spy mission failed' },
          { color: 'white', label: 'All spies were killed' }
        ]
      });
    }

    // Update the selectedArea and selectedConnection with the changes
    let areas = session.state.areas;
    const i = areas.findIndex((area) => area.areaId === selectedArea.areaId);
    const j = areas.findIndex((area) => area.areaId === selectedConnection.areaId);

    areas[i] = selectedArea;
    areas[j] = selectedConnection;

    // Deselect areas
    areas = this.resetAreaAndConnections(areas);

    return of(areas);
    // return this.updateGame({
    //   areas
    // });
  }

  resetConnection() {

    const areas = this.cache.session.state.areas;
    const selectedConnection = this.cache.getSelectedConnectedArea();

    // If no connection is selected, do nothing to prevent unnecessary call to the backend
    if (!selectedConnection) {
      return;
    }

    // Deselect the area
    selectedConnection.state.isSelected = false;

    const i = areas.findIndex((area) => area.areaId === selectedConnection.areaId);

    areas[i] = selectedConnection;

    return areas;
    // this.updateGame({
    //   areas
    // });
  }

  preventActions() {
    this.isBlocked = true;
  }

  allowActions() {
    this.isBlocked = false;
  }

  resetAreaAndConnections(areas: Area[]) {

    // Resets all connections
    const _areas = areas.map((area) => {

      area.state.isSelected = false;
      area.state.isConnectedToSelected = false;

      // Set connections to inactivated
      if (!area.state.__ui.isOwnedBySelf) {
        area.state.isActive = false;
      }

      return area;
    });

    return _areas;
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
   *
   * @param spies Number of spies sent to the area
   * @param troopsInArea Number of armies in the area
   */
  private getSpySuccessRate(spies: number, troopsInArea: Armies) {

    const base = spies * 70;
    const negatorPerArmy = (spies / 2) * 7.5;

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
  private getWinRate(attackerPower: number, defenderPower: number) {

    const diff = attackerPower - defenderPower;
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
        return 100 - ((defenderPower / attackerPower) * 100);
      }

      return -(100 - ((attackerPower / defenderPower) * 100));
    })() / 2;

    return base + diffAsPercentage + this.winModifier;
  }

  /**
   * Calculates how many armies that should be lost in the attacking force
   * @param armies The number of armies that were sent to the attacked area
   * @param attackerPower The total power value of the attacker
   * @param defenderPower The total power value of the defender
   */
  private getArmiesLost(armies: ArmiesToDeploy, attackerPower: number, defenderPower: number) {

    const base = 50;
    const diff = attackerPower - defenderPower;
    const diffAsPercentage = (() => {

      if (diff >= 0) {
        return 100 - ((defenderPower / attackerPower) * 100);
      }

      return -(100 - ((attackerPower / defenderPower) * 100));
    })() / 2;

    const chance = base + diffAsPercentage;
    let percentOfArmies;

    if (chance > 80) {
      percentOfArmies = 20;
    }
    else if (chance > 40) {
      percentOfArmies = 40;
    }
    else if (chance > 20) {
      percentOfArmies = 60;
    }
    else if (chance > 0) {
      percentOfArmies = 90;
    }

    const soldiersLost = Math.ceil(armies.soldiers / percentOfArmies);
    const horsesLost = Math.ceil(armies.horses / percentOfArmies);
    const gatlingGunsLost = Math.ceil(armies.gatlingGuns / percentOfArmies);

    return {
      soldiers: soldiersLost,
      horses: horsesLost,
      gatlingGuns: gatlingGunsLost
    }
  }
}