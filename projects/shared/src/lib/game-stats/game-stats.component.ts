import { GameConfig } from './../game.config';
import { Component, Input } from '@angular/core';
import { PipeResult, PlayerState } from '../interfaces';

@Component({
  selector: 'game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent {
  @Input() set result(result: PipeResult) {

    const idle = result.self.state.idle;
    const soldiersPower = idle.soldiers.amount * GameConfig.armyTypes.soldiers.power;
    const horsesPower = idle.horses.amount * GameConfig.armyTypes.horses.power;
    const gatlingGunsPower = idle.gatlingGuns.amount * GameConfig.armyTypes.gatlingGuns.power;

    idle.soldiers.power = soldiersPower;
    idle.horses.power = horsesPower;
    idle.gatlingGuns.power = gatlingGunsPower;
    idle.spies.power = 0;

    this._stats = result.self.state;
  };

  get stats() {
    return this._stats;
  }

  private _stats: PlayerState;

  public totalIdle: number;

  constructor() {}

  // getTotalIdle() {

  //   this.totalIdle = Object.keys(this.stats.idle)
  //     .reduce((acc, curr) => {
  //       return acc += this.stats.idle[curr].amount;
  //     }, 0);
  // }
}
