import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent {
  @Input() set stats(stats: any) {
    this._stats = stats;
    this.getTotalIdle();
  };

  get stats() {
    return this._stats;
  }

  private _stats: any;

  public totalIdle: number;

  constructor() {}

  getTotalIdle() {
    this.totalIdle = Object.keys(this.stats.idle)
      .reduce((acc, curr) => {
        return acc += this.stats.idle[curr].amount;
      }, 0);
  }
}
