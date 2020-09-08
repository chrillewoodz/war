import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[outcomeHost]'
})

export class OutcomeDirective {

  constructor(public viewContainerRef: ViewContainerRef) {}
}