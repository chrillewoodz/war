import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumberBubbleModule } from '../number-bubble/number-bubble.module';
import { GameStatsComponent } from './game-stats.component';

@NgModule({
  imports: [CommonModule, NumberBubbleModule],
  exports: [GameStatsComponent],
  declarations: [GameStatsComponent]
})

export class GameStatsModule {}
