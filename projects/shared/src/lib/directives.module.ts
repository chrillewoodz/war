import { NgModule } from '@angular/core';

import { AreaHandlerDirective } from './area-handler.directive';
import { ClickOutsideDirective } from './click-outside.directive';

@NgModule({
  exports: [AreaHandlerDirective, ClickOutsideDirective],
  declarations: [AreaHandlerDirective, ClickOutsideDirective]
})

export class DirectivesModule {}
