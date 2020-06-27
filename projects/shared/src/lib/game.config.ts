import { Army, ArmyType } from './interfaces';

interface IGameConfig {
  fightModifier: number;
  negativeFightModifier: number;
  armyTypes: {
    soldier: Army,
    horse: Army,
    gatlingGun: Army,
    spy: Army
  }
}

export const GameConfig: IGameConfig = {
  fightModifier: 1.5,
  negativeFightModifier: -10,
  armyTypes: {
    soldier: {
      type: ArmyType.Soldiers,
      power: 1
    },
    horse: {
      type: ArmyType.Horses,
      power: 2
    },
    gatlingGun: {
      type: ArmyType.GatlingGuns,
      power: 4
    },
    spy: {
      type: ArmyType.Spies,
      power: 0
    }
  }
}