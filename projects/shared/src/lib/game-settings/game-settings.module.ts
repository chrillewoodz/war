import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { GameSettingsComponent } from './game-settings.component';
import { DirectivesModule } from '../directives.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, DirectivesModule],
  exports: [GameSettingsComponent],
  declarations: [GameSettingsComponent]
})

export class GameSettingsModule {}
