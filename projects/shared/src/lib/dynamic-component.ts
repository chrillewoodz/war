import { Type } from '@angular/core';

export class DynamicComponent {
  constructor(public component: Type<any>) {}
}
