import { first } from 'rxjs/operators';
import { timer } from 'rxjs';
import { MapEngine } from '../map.engine';
import { Injectable } from '@angular/core';

import { Player, Card, SessionState } from '../interfaces';
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
  interrogateEnemySpies: 'interrogateEnemySpies'
};

@Injectable({
  providedIn: 'root'
})

export class HUDCardsService {

  private cards: Card[] = [
    {
      config: {
        id: CardIDs.localMilitia,
        image: 'assets/SVG/soldiers.svg',
        title: 'Local militia',
        description: 'Gain +2 soldiers in the selected area',
        cost: 3
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.localMilitia).config.cost),
      action: () => {

        const amount = 2;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.soldiers.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/soldiers.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.localMilitia).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} soldiers` }
          ]
        });

        return {
          map: {
            areas: findAndReplace(areas, selectedArea)
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.recruitFarmers,
        image: 'assets/SVG/soldiers.svg',
        title: 'Recruit farmers',
        description: 'Gain +1 soldiers in the selected area',
        cost: 2
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.recruitFarmers).config.cost),
      action: () => {

        const amount = 1;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.soldiers.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/soldiers.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.recruitFarmers).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} soldiers` }
          ]
        });

        return {
          map: {
            areas: findAndReplace(areas, selectedArea)
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.callInTheCavalry,
        image: 'assets/SVG/horses.svg',
        title: 'Call in the cavalry',
        description: 'Gain +4 horses in the selected area',
        cost: 5
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.callInTheCavalry).config.cost),
      action: () => {

        const amount = 4;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.horses.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/horses.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.callInTheCavalry).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} horses` }
          ]
        });

        return {
          map: {
            areas: findAndReplace(areas, selectedArea)
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.anUnexpectedAlly,
        image: 'assets/SVG/soldiers.svg',
        title: 'An unexpected ally',
        description: 'Gain +6 soldiers in the selected area',
        cost: 4
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.anUnexpectedAlly).config.cost),
      action: () => {

        const amount = 4;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.soldiers.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/soldiers.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.anUnexpectedAlly).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} soldiers` }
          ]
        });

        return {
          map: {
            areas: findAndReplace(areas, selectedArea)
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.unleashHell,
        image: 'assets/SVG/gatlingGuns.svg',
        title: 'Unleash hell',
        description: 'Gain +6 gatling guns in the selected area',
        cost: 12
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.unleashHell).config.cost),
      action: () => {

        const amount = 6;
        const areas = this.cache.session.state.map.areas;
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
          map: {
            areas: findAndReplace(areas, selectedArea)
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.recruitSpies,
        image: 'assets/SVG/spies.svg',
        title: 'Recruit spies',
        description: 'Gain +2 spies in the selected area',
        cost: 3
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.recruitSpies).config.cost),
      action: () => {

        const amount = 2;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.spies.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/soldiers.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.recruitSpies).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} spies` }
          ]
        });

        return {
          map: {
            areas: findAndReplace(areas, selectedArea)
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.interrogateEnemySpies,
        image: 'assets/SVG/spies.svg',
        title: 'Interrogate enemy spies',
        description: 'Gain area intel on 3 random enemy areas',
        cost: 3
      },
      disabled: () => false || !this.canPlayCard(this.getCard(CardIDs.interrogateEnemySpies).config.cost),
      action: () => {

        // TODO: Simplify this entire thing and make it reuseable
        let areas = this.cache.session.state.map.areas;
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

        randomAreas.forEach((area, i) => {

          timer(100 + (i * 50)).pipe(
            first()
          )
          .subscribe(() => {

            this.mapEngine.loadOutcome({
              area,
              image: 'assets/SVG/spies.svg',
              title: {
                color: '#08c339',
                label: this.getCard(CardIDs.interrogateEnemySpies).config.title
              },
              messages: [
                { color: 'white', label: 'Gained area intel' }
              ]
            });
          });
        });

        return {
          map: {
            areas
          }
        };
      }
    }
  ];

  constructor(
    private cache: GameCache,
    private mapEngine: MapEngine
  ) {}

  use(cardId: string) {

    // A card will perform its action on the cached state
    // and return either any state properties that changed.
    const newState = this.getCard(cardId).action();

    let updatedPlayer = this.afterUse((newState.players && newState.players[this.cache.clientId]) || this.cache.self, cardId);

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
    return this.getCard(cardId).disabled();
  }

  private afterUse(player: Player, cardId: string) {

    const _player = {...player};
    const cardIndex = _player.state.cards.findIndex((card) => card.id === cardId);

    _player.state.cards.splice(cardIndex, 1);
    _player.state.actionPoints.left -= this.getCard(cardId).config.cost;

    return _player;
  }

  getRandomCard() {
    const randomIndex = Math.floor(Math.random() * this.cards.length);
    // Return a copy not the original object to not modify it by accident
    return {...this.cards[randomIndex].config};
  }

  @Bound
  private isAreaSelected() {
    return !!this.cache.getSelectedArea();
  }

  private getCard(cardId: string) {
    return this.cards.find((card) => card.config.id === cardId);
  }

  canPlayCard(cost: number) {
    const self = this.cache.self;
    return self.state.actionPoints.left - cost >= 0;
  }
}