import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumberBubbleComponent } from './number-bubble.component';

@NgModule({
  imports: [CommonModule],
  exports: [NumberBubbleComponent],
  declarations: [NumberBubbleComponent]
})

export class NumberBubbleModule {}
