import { DirectivesModule } from './../directives.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapEuropeComponent } from './map-europe.component';

@NgModule({
  imports: [CommonModule, DirectivesModule],
  exports: [MapEuropeComponent],
  declarations: [MapEuropeComponent]
})

export class MapEuropeModule {}
