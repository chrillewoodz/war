import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LobbyRoutingModule } from './lobby-routing.module';
import { LobbyComponent } from './lobby.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [LobbyComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LobbyRoutingModule
  ]
})
export class LobbyModule { }
