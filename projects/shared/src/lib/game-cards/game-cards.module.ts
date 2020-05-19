import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameCardsComponent } from './game-cards.component';

@NgModule({
  imports: [CommonModule],
  exports: [GameCardsComponent],
  declarations: [GameCardsComponent]
})

export class GameCardsModule {}
