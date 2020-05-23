import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectivesModule } from '../directives.module';
import { AreaInformationComponent } from './area-information.component';

@NgModule({
  imports: [CommonModule, DirectivesModule],
  exports: [AreaInformationComponent],
  declarations: [AreaInformationComponent]
})

export class AreaInformationModule {}
