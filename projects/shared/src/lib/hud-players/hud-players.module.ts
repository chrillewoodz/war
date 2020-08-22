import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HUDPlayersComponent } from './hud-players.component';

@NgModule({
  imports: [CommonModule],
  exports: [HUDPlayersComponent],
  declarations: [HUDPlayersComponent]
})

export class HUDPlayersModule {}
