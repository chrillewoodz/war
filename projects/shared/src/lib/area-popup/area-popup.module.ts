import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectivesModule } from '../directives.module';
import { AreaPopupComponent } from './area-popup.component';

@NgModule({
  imports: [CommonModule, DirectivesModule],
  exports: [AreaPopupComponent],
  declarations: [AreaPopupComponent]
})

export class AreaPopupModule {}
