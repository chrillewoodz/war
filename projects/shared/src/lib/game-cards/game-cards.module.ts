import { CardModule } from './card/card.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameCardsComponent } from './game-cards.component';

@NgModule({
  imports: [CommonModule, CardModule],
  exports: [GameCardsComponent],
  declarations: [GameCardsComponent]
})

export class GameCardsModule {}
