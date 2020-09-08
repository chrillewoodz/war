import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HUDLoggerComponent } from './hud-logger.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [HUDLoggerComponent],
  declarations: [HUDLoggerComponent]
})

export class HUDLoggerModule {}
