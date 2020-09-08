import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutcomeComponent } from './outcome.component';
import { OutcomeDirective } from './outcome.directive';

@NgModule({
  imports: [CommonModule],
  exports: [OutcomeComponent, OutcomeDirective],
  declarations: [OutcomeComponent, OutcomeDirective]
})

export class OutcomeModule {}
