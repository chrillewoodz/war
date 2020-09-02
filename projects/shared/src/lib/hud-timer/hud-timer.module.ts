import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HUDTimerComponent } from './hud-timer.component';

@NgModule({
  imports: [CommonModule],
  exports: [HUDTimerComponent],
  declarations: [HUDTimerComponent]
})

export class HUDTimerModule {}
