import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalComponent } from './modal.component';
import { DirectivesModule } from '../directives.module';

@NgModule({
  imports: [CommonModule, DirectivesModule],
  exports: [ModalComponent],
  declarations: [ModalComponent]
})

export class ModalModule {}
