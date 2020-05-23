import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { GameLoggerComponent } from './game-logger.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [GameLoggerComponent],
  declarations: [GameLoggerComponent]
})

export class GameLoggerModule {}
