import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumberBubbleModule } from '../number-bubble/number-bubble.module';
import { HUDStatsComponent } from './hud-stats.component';

@NgModule({
  imports: [CommonModule, NumberBubbleModule],
  exports: [HUDStatsComponent],
  declarations: [HUDStatsComponent]
})

export class HUDStatsModule {}
