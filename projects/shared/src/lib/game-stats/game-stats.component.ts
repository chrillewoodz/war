import { Component, Input } from '@angular/core';
import { PipeResult, PlayerState } from '../interfaces';

@Component({
  selector: 'game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent {
  @Input() set result(result: PipeResult) {
    this._stats = result.self.state;
    this.getTotalIdle();
  };

  get stats() {
    return this._stats;
  }

  private _stats: PlayerState;

  public totalIdle: number;

  constructor() {}

  getTotalIdle() {

    this.totalIdle = Object.keys(this.stats.idle)
      .reduce((acc, curr) => {
        return acc += this.stats.idle[curr].amount;
      }, 0);
  }
}
