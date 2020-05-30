import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { SessionComponent } from './session.component';

import {
  DirectivesModule,
  ActionPointsModule,
  AreaInformationModule,
  AreaPopupModule,
  GameCardsModule,
  GameLoggerModule,
  GameStatsModule,
  MapEuropeModule,
  PlayersModule,
  ScreenFightModule,
  TimerModule
} from 'shared';

@NgModule({
  declarations: [SessionComponent],
  imports: [
    CommonModule,
    SessionRoutingModule,

     // Shared
     DirectivesModule,
     ActionPointsModule,
     AreaInformationModule,
     AreaPopupModule,
     GameCardsModule,
     GameLoggerModule,
     GameStatsModule,
     MapEuropeModule,
     PlayersModule,
     ScreenFightModule,
     TimerModule
  ]
})

export class SessionModule { }
