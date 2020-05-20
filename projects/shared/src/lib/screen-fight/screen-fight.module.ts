import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulletsModule } from '../bullets/bullets.module';
import { ScreenFightComponent } from './screen-fight.component';

@NgModule({
  imports: [CommonModule, BulletsModule],
  exports: [ScreenFightComponent],
  declarations: [ScreenFightComponent]
})

export class ScreenFightModule {}
