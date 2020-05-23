import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DirectivesModule,
  ActionPointsModule,
  AreaInformationModule,
  AreaPopupModule,
  GameCardsModule,
  GameLoggerModule,
  GameStatsModule,
  MapEuropeModule,
  ScreenFightModule,
  TimerModule
} from 'shared';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    DirectivesModule,
    ActionPointsModule,
    AreaInformationModule,
    AreaPopupModule,
    GameCardsModule,
    GameLoggerModule,
    GameStatsModule,
    MapEuropeModule,
    ScreenFightModule,
    TimerModule
  ],
  exports: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
