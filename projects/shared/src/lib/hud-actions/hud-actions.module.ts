import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ActionPointsModule } from '../action-points/action-points.module';
import { HUDActionsComponent } from './hud-actions.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ActionPointsModule
  ],
  exports: [HUDActionsComponent],
  declarations: [HUDActionsComponent]
})

export class HUDActionsModule {}
