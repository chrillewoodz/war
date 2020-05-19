import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-stats',
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss']
})
export class GameStatsComponent {
  @Input() stats: any;

  constructor() {}
}
