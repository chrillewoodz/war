import { MapEngine } from './../map.engine';
import { Injectable } from '@angular/core';

import { Player, Card, SessionState } from '../interfaces';
import { SocketApi } from '../socket.api';
import { GameCache } from '../game.cache';
import { findAndReplace } from '../helpers';
import { Bound } from '../decorators';

const CardIDs = {
  localMilitia: 'localMilitia',
  recruitFarmers: 'recruitFarmers',
  callInTheCavalry: 'callInTheCavalry',
  anUnexpectedAlly: 'anUnexpectedAlly',
  unleashHell: 'unleashHell',
  recruitSpies: 'recruitSpies',
  interrogeEnemySpies: 'interrogeEnemySpies'
};

@Injectable({
  providedIn: 'root'
})

export class CardsService {

  private cards: Card[] = [
    {
      id: CardIDs.localMilitia,
      image: 'assets/SVG/soldiers.svg',
      title: 'Local militia',
      description: 'Gain +2 soldiers in the selected area',
      cost: 3
    },
    {
      id: CardIDs.recruitFarmers,
      image: 'assets/SVG/soldiers.svg',
      title: 'Recruit farmers',
      description: 'Gain +1 soldiers in the selected area',
      cost: 2
    },
    {
      id: CardIDs.callInTheCavalry,
      image: 'assets/SVG/horses.svg',
      title: 'Call in the cavalry',
      description: 'Gain +4 horses in the selected area',
      cost: 5
    },
    {
      id: CardIDs.anUnexpectedAlly,
      image: 'assets/SVG/soldiers.svg',
      title: 'An unexpected ally',
      description: 'Gain +6 soldiers in the selected area',
      cost: 4
    },
    {
      id: CardIDs.unleashHell,
      image: 'assets/SVG/gatlingGuns.svg',
      title: 'Unleash hell',
      description: 'Gain +6 gatling guns in the selected area',
      cost: 10
    },
    {
      id: CardIDs.recruitSpies,
      image: 'assets/SVG/spies.svg',
      title: 'Recruit spies',
      description: 'Gain +2 spies in the selected area',
      cost: 3
    },
    {
      id: CardIDs.interrogeEnemySpies,
      image: 'assets/SVG/spies.svg',
      title: 'Interrogate enemy spies',
      description: 'Gain area intel on 3 random enemy areas',
      cost: 3
    }
  ];

  private cardActions: {[k: string]: () => Partial<SessionState>} = {
    [CardIDs.localMilitia]: () => {

      const amount = 2;
      const areas = this.cache.session.state.areas;
      const selectedArea =  this.cache.getSelectedArea();

      selectedArea.state.armies.soldiers.amount += amount;

      this.mapEngine.loadOutcome({
        area: selectedArea,
        image: 'assets/SVG/soldiers.svg',
        title: {
          color: '#08c339',
          label: this.getCard(CardIDs.localMilitia).title
        },
        messages: [
          { color: 'white', label: `+${amount} soldiers` }
        ]
      });

      return {
        areas: findAndReplace(areas, selectedArea)
      };
    },
    [CardIDs.recruitFarmers]: () => {

      const amount = 1;
      const areas = this.cache.session.state.areas;
      const selectedArea =  this.cache.getSelectedArea();

      selectedArea.state.armies.soldiers.amount += amount;

      this.mapEngine.loadOutcome({
        area: selectedArea,
        image: 'assets/SVG/soldiers.svg',
        title: {
          color: '#08c339',
          label: this.getCard(CardIDs.recruitFarmers).title
        },
        messages: [
          { color: 'white', label: `+${amount} soldiers` }
        ]
      });

      return {
        areas: findAndReplace(areas, selectedArea)
      };
    },
    [CardIDs.callInTheCavalry]: () => {

      const amount = 4;
      const areas = this.cache.session.state.areas;
      const selectedArea =  this.cache.getSelectedArea();

      selectedArea.state.armies.horses.amount += amount;

      this.mapEngine.loadOutcome({
        area: selectedArea,
        image: 'assets/SVG/horses.svg',
        title: {
          color: '#08c339',
          label: this.getCard(CardIDs.callInTheCavalry).title
        },
        messages: [
          { color: 'white', label: `+${amount} horses` }
        ]
      });

      return {
        areas: findAndReplace(areas, selectedArea)
      };
    },
    [CardIDs.anUnexpectedAlly]: () => {

      const amount = 4;
      const areas = this.cache.session.state.areas;
      const selectedArea =  this.cache.getSelectedArea();

      selectedArea.state.armies.soldiers.amount += amount;

      this.mapEngine.loadOutcome({
        area: selectedArea,
        image: 'assets/SVG/soldiers.svg',
        title: {
          color: '#08c339',
          label: this.getCard(CardIDs.anUnexpectedAlly).title
        },
        messages: [
          { color: 'white', label: `+${amount} soldiers` }
        ]
      });

      return {
        areas: findAndReplace(areas, selectedArea)
      };
    },
    [CardIDs.unleashHell]: () => {

      const amount = 6;
      const areas = this.cache.session.state.areas;
      const selectedArea =  this.cache.getSelectedArea();

      selectedArea.state.armies.gatlingGuns.amount += amount;

      this.mapEngine.loadOutcome({
        area: selectedArea,
        image: 'assets/SVG/gatlingGuns.svg',
        title: {
          color: '#08c339',
          label: 'Success'
        },
        messages: [
          { color: 'white', label: `+${amount} gatling guns` }
        ]
      });

      return {
        areas: findAndReplace(areas, selectedArea)
      };
    },
    [CardIDs.recruitSpies]: () => {

      const amount = 2;
      const areas = this.cache.session.state.areas;
      const selectedArea =  this.cache.getSelectedArea();

      selectedArea.state.armies.spies.amount += amount;

      this.mapEngine.loadOutcome({
        area: selectedArea,
        image: 'assets/SVG/soldiers.svg',
        title: {
          color: '#08c339',
          label: this.getCard(CardIDs.recruitSpies).title
        },
        messages: [
          { color: 'white', label: `+${amount} spies` }
        ]
      });

      return {
        areas: findAndReplace(areas, selectedArea)
      };
    },
    [CardIDs.interrogeEnemySpies]:  () => {

      // TODO: Simplify this entire thing and make it reuseable
      let areas = this.cache.session.state.areas;
      const enemyAreas = [...areas].filter((area) => !area.state.__ui.isOwnedBySelf && !(area.state.occupiedBy && area.state.occupiedBy[this.cache.clientId]));

      function getRandomArea() {
        const randomIndex = Math.floor(Math.random() * (enemyAreas.length - 1));
        const area = enemyAreas.splice(randomIndex, 1)[0];
        return area;
      }

      let randomAreas = [
        getRandomArea(),
        getRandomArea(),
        getRandomArea()
      ];

      randomAreas = randomAreas.map((area) => {
        area.state.spiedOnBy[this.cache.clientId] = this.cache.self;
        return area;
      });

      areas = findAndReplace(areas, randomAreas[0]);
      areas = findAndReplace(areas, randomAreas[1]);
      areas = findAndReplace(areas, randomAreas[2]);

      randomAreas.forEach((area) => {

        this.mapEngine.loadOutcome({
          area,
          image: 'assets/SVG/spies.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.interrogeEnemySpies).title
          },
          messages: [
            { color: 'white', label: 'Gained area intel' }
          ]
        });
      });

      return {
        areas
      };
    }
  }

  private cardDisabledChecks: {[k: string]: () => boolean} = {
    [CardIDs.localMilitia]: () => !this.isAreaSelected(),
    [CardIDs.recruitFarmers]: () => !this.isAreaSelected(),
    [CardIDs.callInTheCavalry]: () => !this.isAreaSelected(),
    [CardIDs.anUnexpectedAlly]: () => !this.isAreaSelected(),
    [CardIDs.unleashHell]: () => !this.isAreaSelected(),
    [CardIDs.recruitSpies]: () => !this.isAreaSelected(),
    [CardIDs.interrogeEnemySpies]: () => false
  }

  constructor(
    private cache: GameCache,
    private mapEngine: MapEngine
  ) {}

  use(cardId: string) {

    // A card will perform its action on the cached state
    // and return either any state properties that changed.
    const newState = this.cardActions[cardId]();

    const updatedPlayer = this.removeCardFromPlayer((newState.players && newState.players[this.cache.clientId]) || this.cache.self, cardId);

    if (newState.players) {
      newState.players[this.cache.clientId] = updatedPlayer;
    }
    else {
      newState.players = {
        ...this.cache.session.state.players,
        [this.cache.clientId]: updatedPlayer
      }
    }

    return newState;
  }

  checkDisabledState(cardId: string) {
    return this.cardDisabledChecks[cardId];
  }

  removeCardFromPlayer(player: Player, cardId: string) {

    const _player = {...player};
    const cardIndex = _player.state.cards.findIndex((card) => card.id === cardId);

    _player.state.cards.splice(cardIndex, 1);

    return _player;
  }

  getRandomCard() {
    const randomIndex = Math.floor(Math.random() * this.cards.length);
    console.log(randomIndex, this.cards[randomIndex], {...this.cards[randomIndex]})
    // Return a copy not the original object to not modify it by accident
    return {...this.cards[randomIndex]};
  }

  @Bound
  private isAreaSelected() {
    return !!this.cache.getSelectedArea();
  }

  private getCard(cardId: string) {
    return this.cards.find((card) => card.id === cardId);
  }
}