import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulletsComponent } from './bullets.component';

@NgModule({
  imports: [CommonModule],
  exports: [BulletsComponent],
  declarations: [BulletsComponent]
})

export class BulletsModule {}
