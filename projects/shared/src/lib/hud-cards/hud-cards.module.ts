import { CardModule } from './card/card.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HUDCardsComponent } from './hud-cards.component';

@NgModule({
  imports: [CommonModule, CardModule],
  exports: [HUDCardsComponent],
  declarations: [HUDCardsComponent]
})

export class HUDCardsModule {}
