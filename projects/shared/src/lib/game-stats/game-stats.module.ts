import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameStatsComponent } from './game-stats.component';

@NgModule({
  imports: [CommonModule],
  exports: [GameStatsComponent],
  declarations: [GameStatsComponent]
})

export class GameStatsModule {}
