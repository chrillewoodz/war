import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HUDSettingsComponent } from './hud-settings.component';
import { DirectivesModule } from '../directives.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, DirectivesModule],
  exports: [HUDSettingsComponent],
  declarations: [HUDSettingsComponent]
})

export class HUDSettingsModule {}
