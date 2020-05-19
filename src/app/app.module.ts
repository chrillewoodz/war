import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionPointsModule, GameCardsModule, GameStatsModule, ScreenFightModule, TimerModule } from 'shared';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ActionPointsModule,
    GameCardsModule,
    GameStatsModule,
    ScreenFightModule,
    TimerModule
  ],
  exports: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
