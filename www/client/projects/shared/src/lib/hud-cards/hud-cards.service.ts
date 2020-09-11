import { HUDLoggerService } from '../hud-logger/hud-logger.service';
import { Area, ArmyType, Army, GameEvent } from '../interfaces';
import { first, switchMap } from 'rxjs/operators';
import { timer, of } from 'rxjs';
import { MapEngine } from '../map.engine';
import { Injectable } from '@angular/core';

import { Player, Card } from '../interfaces';
import { GameCache } from '../game.cache';
import { findAndReplace } from '../helpers';
import { Bound } from '../decorators';

export const CardIDs = {
  localMilitia1: 'localMilitia1',
  localMilitia2: 'localMilitia2',
  localMilitia3: 'localMilitia3',
  recruitFarmers: 'recruitFarmers',
  callInTheCavalry1: 'callInTheCavalry1',
  callInTheCavalry2: 'callInTheCavalry2',
  callInTheCavalry3: 'callInTheCavalry3',
  unleashHell1: 'unleashHell1',
  unleashHell2: 'unleashHell2',
  unleashHell3: 'unleashHell3',
  resistance1: 'resistance1',
  resistance2: 'resistance2',
  resistance3: 'resistance3',
  recruitSpies1: 'recruitSpies1',
  recruitSpies2: 'recruitSpies2',
  recruitSpies3: 'recruitSpies3',
  anUnexpectedAlly: 'anUnexpectedAlly',
  interrogateEnemySpies: 'interrogateEnemySpies',
  pandemic: 'pandemic',
  bubonicPlague: 'bubonicPlague',
  famine: 'famine',
  poisonFoodStorages: 'poisonFoodStorages',
  winterImmunity: 'winterImmunity',
  summerImmunity: 'summerImmunity',
  autumnImmunity: 'autumnImmunity'
};

@Injectable({
  providedIn: 'root'
})

export class HUDCardsService {

  private cards: Card[] = [
    {
      config: {
        id: CardIDs.localMilitia1,
        image: 'assets/SVG/soldiers.svg',
        title: 'Local militia',
        description: 'Gain +2 soldiers in the selected area',
        cost: 3
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.localMilitia1).config.cost),
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
            label: this.getCard(CardIDs.localMilitia1).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} soldiers` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.localMilitia2,
        image: 'assets/SVG/soldiers.svg',
        title: 'Local militia',
        description: 'Gain +6 soldiers in the selected area',
        cost: 4
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.localMilitia2).config.cost),
      action: () => {

        const amount = 6;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.soldiers.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/soldiers.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.localMilitia2).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} soldiers` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.localMilitia3,
        image: 'assets/SVG/soldiers.svg',
        title: 'Local militia',
        description: 'Gain +10 soldiers in the selected area',
        cost: 6
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.localMilitia3).config.cost),
      action: () => {

        const amount = 10;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.soldiers.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/soldiers.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.localMilitia3).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} soldiers` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
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
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.callInTheCavalry1,
        image: 'assets/SVG/horses.svg',
        title: 'Call in the cavalry',
        description: 'Gain +2 horses in the selected area',
        cost: 3
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.callInTheCavalry1).config.cost),
      action: () => {

        const amount = 2;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.horses.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/horses.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.callInTheCavalry1).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} horses` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.callInTheCavalry2,
        image: 'assets/SVG/horses.svg',
        title: 'Call in the cavalry',
        description: 'Gain +4 horses in the selected area',
        cost: 4
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.callInTheCavalry2).config.cost),
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
            label: this.getCard(CardIDs.callInTheCavalry2).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} horses` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.callInTheCavalry3,
        image: 'assets/SVG/horses.svg',
        title: 'Call in the cavalry',
        description: 'Gain +6 horses in the selected area',
        cost: 8
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.callInTheCavalry3).config.cost),
      action: () => {

        const amount = 6;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.horses.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/horses.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.callInTheCavalry3).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} horses` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.unleashHell1,
        image: 'assets/SVG/gatlingGuns.svg',
        title: 'Unleash hell',
        description: 'Gain +2 gatling guns in the selected area',
        cost: 3
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.unleashHell1).config.cost),
      action: () => {

        const amount = 2;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.gatlingGuns.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/gatlingGuns.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.unleashHell1).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} gatling guns` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.unleashHell2,
        image: 'assets/SVG/gatlingGuns.svg',
        title: 'Unleash hell',
        description: 'Gain +4 gatling guns in the selected area',
        cost: 5
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.unleashHell2).config.cost),
      action: () => {

        const amount = 4;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.gatlingGuns.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/gatlingGuns.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.unleashHell2).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} gatling guns` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.unleashHell3,
        image: 'assets/SVG/gatlingGuns.svg',
        title: 'Unleash hell',
        description: 'Gain +6 gatling guns in the selected area',
        cost: 10
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.unleashHell3).config.cost),
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
            label: this.getCard(CardIDs.unleashHell3).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} gatling guns` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.resistance1,
        image: 'assets/SVG/resistance.svg',
        title: 'Resistance',
        description: 'The people in 1 random enemy area will overthrow the government and pledge their allegiance to you instead',
        cost: 3,
        gameEvent: GameEvent.ResistanceOutcome
      },
      callback: (logger: HUDLoggerService) => {

        return logger.log({
          message: `${logger.getColoredString('darkred', 'Viva la resistance!')}`,
        });
      },
      disabled: () => !this.canPlayCard(this.getCard(CardIDs.resistance1).config.cost),
      action: () => {

        const self = this.cache.self;
        const areas = this.cache.session.state.map.areas;
        const enemyAreas = areas.filter((area) => area.state.occupiedBy.clientId !== self.clientId);
        const affectedArea = this.overthrowRandomArea(enemyAreas);

        return {
          extras: {
            affectedAreas: [affectedArea]
          },
          newState: {
            map: {
              areas: findAndReplace(areas, affectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.resistance2,
        image: 'assets/SVG/resistance.svg',
        title: 'Resistance',
        description: 'The people in 2 random enemy areas will overthrow the government and pledge their allegiance to you instead',
        cost: 5,
        gameEvent: GameEvent.ResistanceOutcome
      },
      callback: (logger: HUDLoggerService) => {

        return logger.log({
          message: `${logger.getColoredString('darkred', 'Viva la resistance!')}`,
        });
      },
      disabled: () => !this.canPlayCard(this.getCard(CardIDs.resistance2).config.cost),
      action: () => {

        const self = this.cache.self;
        const areas = this.cache.session.state.map.areas;
        const enemyAreas = areas.filter((area) => area.state.occupiedBy.clientId !== self.clientId);
        const affectedAreas = [
          this.overthrowRandomArea(enemyAreas),
          this.overthrowRandomArea(enemyAreas)
        ];

        return {
          extras: {
            affectedAreas
          },
          newState: {
            map: {
              areas
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.resistance3,
        image: 'assets/SVG/resistance.svg',
        title: 'Resistance',
        description: 'The people in 4 random enemy areas will overthrow the government and pledge their allegiance to you instead',
        cost: 14,
        gameEvent: GameEvent.ResistanceOutcome
      },
      callback: (logger: HUDLoggerService) => {

        return logger.log({
          message: `${logger.getColoredString('darkred', 'Viva la resistance!')}`,
        });
      },
      disabled: () => !this.canPlayCard(this.getCard(CardIDs.resistance3).config.cost),
      action: () => {

        const self = this.cache.self;
        const areas = this.cache.session.state.map.areas;
        const enemyAreas = areas.filter((area) => area.state.occupiedBy.clientId !== self.clientId);
        const affectedAreas = [
          this.overthrowRandomArea(enemyAreas),
          this.overthrowRandomArea(enemyAreas),
          this.overthrowRandomArea(enemyAreas),
          this.overthrowRandomArea(enemyAreas)
        ];

        return {
          extras: {
            affectedAreas
          },
          newState: {
            map: {
              areas
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.recruitSpies1,
        image: 'assets/SVG/spies.svg',
        title: 'Recruit spies',
        description: 'Gain +2 spies in the selected area',
        cost: 3
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.recruitSpies1).config.cost),
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
            label: this.getCard(CardIDs.recruitSpies1).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} spies` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.recruitSpies2,
        image: 'assets/SVG/spies.svg',
        title: 'Recruit spies',
        description: 'Gain +4 spies in the selected area',
        cost: 4
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.recruitSpies2).config.cost),
      action: () => {

        const amount = 4;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.spies.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/soldiers.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.recruitSpies2).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} spies` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.recruitSpies3,
        image: 'assets/SVG/spies.svg',
        title: 'Recruit spies',
        description: 'Gain +6 spies in the selected area',
        cost: 6
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.recruitSpies3).config.cost),
      action: () => {

        const amount = 6;
        const areas = this.cache.session.state.map.areas;
        const selectedArea =  this.cache.getSelectedArea();

        selectedArea.state.armies.spies.amount += amount;

        this.mapEngine.loadOutcome({
          area: selectedArea,
          image: 'assets/SVG/soldiers.svg',
          title: {
            color: '#08c339',
            label: this.getCard(CardIDs.recruitSpies3).config.title
          },
          messages: [
            { color: 'white', label: `+${amount} spies` }
          ]
        });

        return {
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.anUnexpectedAlly,
        image: 'assets/SVG/soldiers.svg',
        title: 'An unexpected ally',
        description: 'Gain +14 soldiers in the selected area',
        cost: 6
      },
      disabled: () => !this.isAreaSelected() || !this.canPlayCard(this.getCard(CardIDs.anUnexpectedAlly).config.cost),
      action: () => {

        const amount = 14;
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
          newState: {
            map: {
              areas: findAndReplace(areas, selectedArea)
            }
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
          newState: {
            map: {
              areas
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.pandemic,
        image: 'assets/SVG/plague.svg',
        title: 'Pandemic',
        description: 'A new disease hits Europe, hard.', // TODO: Set name according to chosen map
        cost: 20,
        gameEvent: GameEvent.PandemicOutcome
      },
      callback: (logger: HUDLoggerService) => {

        return logger.log({
          message: `${logger.getColoredString('darkred', 'Death is upon us all...')}`,
        });
      },
      disabled: () => !this.canPlayCard(this.getCard(CardIDs.pandemic).config.cost),
      action: () => {

        let areas = this.cache.session.state.map.areas;

        function killArmies(area: Area, armyType: ArmyType) {
          return Math.ceil(((area.state.armies[armyType] as Army).amount / 100) * 70); // 70% of all armies will die
        }

        areas = areas.map((area) => {

          area.state.armies.soldiers.amount -= killArmies(area, ArmyType.Soldiers);
          area.state.armies.horses.amount -= killArmies(area, ArmyType.Horses);
          area.state.armies.gatlingGuns.amount -= killArmies(area, ArmyType.GatlingGuns);
          area.state.armies.spies.amount -= killArmies(area, ArmyType.Spies);

          return area;
        });

        return {
          extras: {
            affectedAreas: areas
          },
          newState: {
            map: {
              areas
            }
          }
        };
      },
    },
    {
      config: {
        id: CardIDs.bubonicPlague,
        image: 'assets/SVG/ship.svg',
        title: 'Bubonic plague',
        description: 'Send ships full of infectious rats to the south and west of Europe',
        cost: 11,
        gameEvent: GameEvent.BubonicPlagueOutcome
      },
      callback: (logger: HUDLoggerService) => {

        return logger.log({
          message: `${logger.getColoredString('darkred', 'So much suffering... So much... death.')}`,
        });
      },
      disabled: () => !this.canPlayCard(this.getCard(CardIDs.bubonicPlague).config.cost),
      action: () => {

        const affectedAreas = [];
        let areas = this.cache.session.state.map.areas;

        function killArmies(area: Area, armyType: ArmyType) {
          return Math.ceil(((area.state.armies[armyType] as Army).amount / 100) * 35); // 35% of all armies will die
        }

        areas = areas.map((area) => {

          if (area.events.bubonicPlague) {

            area.state.armies.soldiers.amount -= killArmies(area, ArmyType.Soldiers);
            area.state.armies.horses.amount -= killArmies(area, ArmyType.Horses);
            area.state.armies.gatlingGuns.amount -= killArmies(area, ArmyType.GatlingGuns);
            area.state.armies.spies.amount -= killArmies(area, ArmyType.Spies);

            affectedAreas.push(area);
          }

          return area;
        });

        return {
          extras: {
            affectedAreas
          },
          newState: {
            map: {
              areas
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.famine,
        image: 'assets/SVG/famine.svg',
        title: 'Famine',
        description: 'Block trade routes to northern and eastern Europe, causing severe and long-lasting famine.',
        cost: 9,
        gameEvent: GameEvent.FamineOutcome
      },
      callback: (logger: HUDLoggerService) => {

        return logger.log({
          message: `${logger.getColoredString('darkred', 'Hungry? Your neighbor looks tasty...')}`,
        });
      },
      disabled: () => !this.canPlayCard(this.getCard(CardIDs.famine).config.cost),
      action: () => {

        const affectedAreas = [];
        let areas = this.cache.session.state.map.areas;

        function killArmies(area: Area, armyType: ArmyType) {
          return Math.ceil(((area.state.armies[armyType] as Army).amount / 100) * 40); // 40% of all armies will die
        }

        areas = areas.map((area) => {

          if (area.events.famine) {

            area.state.armies.soldiers.amount -= killArmies(area, ArmyType.Soldiers);
            area.state.armies.horses.amount -= killArmies(area, ArmyType.Horses);
            area.state.armies.gatlingGuns.amount -= killArmies(area, ArmyType.GatlingGuns);
            area.state.armies.spies.amount -= killArmies(area, ArmyType.Spies);

            affectedAreas.push(area);
          }

          return area;
        });

        return {
          extras: {
            affectedAreas
          },
          newState: {
            map: {
              areas
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.poisonFoodStorages,
        image: 'assets/SVG/poisoned.svg',
        title: 'Poison food storages',
        description: 'Command your spies to poison the enemy food storages in the area they are in',
        cost: 10,
        gameEvent: GameEvent.PoisonFoodStoragesOutcome
      },
      callback: (logger: HUDLoggerService) => {

        return logger.log({
          message: `${logger.getColoredString('#8fb239', 'A feast to remember...')}`,
        });
      },
      disabled: () => !this.canPlayCard(this.getCard(CardIDs.poisonFoodStorages).config.cost),
      action: () => {

        const affectedAreas = [];
        let areas = this.cache.session.state.map.areas;

        function killArmies(area: Area, armyType: ArmyType) {
          return Math.ceil(((area.state.armies[armyType] as Army).amount / 100) * 50); // 50% of all armies will die
        }

        areas = areas.map((area) => {

          if (area.state.__ui.isSpiedOnBySelf && !area.state.__ui.isOwnedBySelf) {

            area.state.armies.soldiers.amount -= killArmies(area, ArmyType.Soldiers);
            area.state.armies.horses.amount -= killArmies(area, ArmyType.Horses);
            area.state.armies.gatlingGuns.amount -= killArmies(area, ArmyType.GatlingGuns);
            area.state.armies.spies.amount -= killArmies(area, ArmyType.Spies);

            affectedAreas.push(area);
          }

          return area;
        });

        return {
          extras: {
            affectedAreas
          },
          newState: {
            map: {
              areas
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.winterImmunity,
        image: 'assets/SVG/fur-coat.svg',
        title: 'Fur coats',
        description: 'Equip your armies with fur coats in areas affected by winter, protecting them against freezing cold',
        cost: 6
      },
      disabled: () => !this.canPlayCard(this.getCard(CardIDs.winterImmunity).config.cost),
      action: () => {

        const affectedAreas = [];
        let areas = this.cache.session.state.map.areas;

        areas = areas.map((area) => {

          if (area.events.winter && area.state.__ui.isOwnedBySelf) {
            area.state.immunities.winter = true;

            this.mapEngine.loadOutcome({
              area,
              image: 'assets/SVG/fur-coat.svg',
              title: {
                color: '#82D0D3',
                label: this.getCard(CardIDs.winterImmunity).config.title
              },
              messages: [
                { color: 'white', label: 'Immune to freezing cold' }
              ]
            });

            affectedAreas.push(area);
          }

          return area;
        });

        return {
          extras: {
            affectedAreas
          },
          newState: {
            map: {
              areas
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.summerImmunity,
        image: 'assets/SVG/barrel.svg',
        title: 'Store freshwater',
        description: 'Put out barrels to store freshwater from rainfall, protecting armies in areas affected by summer against dehydration and overheating',
        cost: 6
      },
      disabled: () => !this.canPlayCard(this.getCard(CardIDs.summerImmunity).config.cost),
      action: () => {

        const affectedAreas = [];
        let areas = this.cache.session.state.map.areas;

        areas = areas.map((area) => {

          if (area.events.summer && area.state.__ui.isOwnedBySelf) {
            area.state.immunities.summer = true;

            this.mapEngine.loadOutcome({
              area,
              image: 'assets/SVG/barrel.svg',
              title: {
                color: '#FFBE6A',
                label: this.getCard(CardIDs.summerImmunity).config.title
              },
              messages: [
                { color: 'white', label: 'Immune to scorching heat' }
              ]
            });

            affectedAreas.push(area);
          }

          return area;
        });

        return {
          extras: {
            affectedAreas
          },
          newState: {
            map: {
              areas
            }
          }
        };
      }
    },
    {
      config: {
        id: CardIDs.autumnImmunity,
        image: 'assets/SVG/sand-bags.svg',
        title: 'Barricades',
        description: 'Use sandbags to barricade rivers and lakes, preventing them from flooding in areas affected by autumn',
        cost: 6
      },
      disabled: () => !this.canPlayCard(this.getCard(CardIDs.autumnImmunity).config.cost),
      action: () => {

        const affectedAreas = [];
        let areas = this.cache.session.state.map.areas;

        areas = areas.map((area) => {

          if (area.events.autumn && area.state.__ui.isOwnedBySelf) {
            area.state.immunities.autumn = true;

            this.mapEngine.loadOutcome({
              area,
              image: 'assets/SVG/sand-bags.svg',
              title: {
                color: '#B48400',
                label: this.getCard(CardIDs.autumnImmunity).config.title
              },
              messages: [
                { color: 'white', label: 'Immune to floods' }
              ]
            });

            affectedAreas.push(area);
          }

          return area;
        });

        return {
          extras: {
            affectedAreas
          },
          newState: {
            map: {
              areas
            }
          }
        };
      }
    },
  ];

  constructor(
    private cache: GameCache,
    private mapEngine: MapEngine
  ) {}

  use(cardId: string, deckIndex: number, logger: HUDLoggerService) {

    // A card will perform its action on the cached state
    // and return either any state properties that changed.
    const card = this.getCard(cardId);

    if (!card.callback) {
      return this.getActionResponseObservable(card, deckIndex);
    }

    return (card.callback(logger) || of(null)).pipe(
      first(),
      switchMap(() => this.getActionResponseObservable(card, deckIndex))
    );
  }

  checkDisabledState(cardId: string) {
    return this.getCard(cardId).disabled();
  }

  private getActionResponseObservable(card: Card, deckIndex: number) {

    const actionResponse = card.action();

    let updatedPlayer = this.afterUse((actionResponse.newState.players && actionResponse.newState.players[this.cache.clientId]) || this.cache.self, card.config.id, deckIndex);

    if (actionResponse.newState.players) {
      actionResponse.newState.players[this.cache.clientId] = updatedPlayer;
    }
    else {
      actionResponse.newState.players = {
        ...this.cache.session.state.players,
        [this.cache.clientId]: updatedPlayer
      }
    }

    return of(actionResponse);
  }

  private afterUse(player: Player, cardId: string, deckIndex: number) {

    const _player = {...player};

    _player.state.cards.splice(deckIndex, 1);
    _player.state.actionPoints.left -= this.getCard(cardId).config.cost;

    return _player;
  }

  private overthrowRandomArea(enemyAreas: Area[]) {

    const self = this.cache.self;
    const index = Math.floor(Math.random() * enemyAreas.length);
    const randomArea = enemyAreas[index];

    randomArea.state.occupiedBy = self;

    // Remove to not randomize the same area twice
    enemyAreas.splice(index, 1);

    return randomArea;
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

  getCard(cardId: string) {
    return this.cards.find((card) => card.config.id === cardId);
  }

  canPlayCard(cost: number) {
    const self = this.cache.self;
    return self.state.actionPoints.left - cost >= 0;
  }
}
