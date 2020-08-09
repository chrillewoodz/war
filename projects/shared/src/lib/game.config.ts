import { Army, ArmyType } from './interfaces';

interface IGameConfig {
  fightModifier: number;
  negativeFightModifier: number;
  armyTypes: {
    soldiers: Army;
    horses: Army;
    gatlingGuns: Army;
    spies: Army;
  }
}

export const GameConfig: IGameConfig = {
  fightModifier: 1.5,
  negativeFightModifier: -10,
  armyTypes: {
    soldiers: {
      type: ArmyType.Soldiers,
      power: 1
    },
    horses: {
      type: ArmyType.Horses,
      power: 2
    },
    gatlingGuns: {
      type: ArmyType.GatlingGuns,
      power: 4
    },
    spies: {
      type: ArmyType.Spies,
      power: 0
    }
  }
}