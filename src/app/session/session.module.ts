import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { SessionComponent } from './session.component';

import {
  DirectivesModule,
  ActionPointsModule,
  HUDActionsModule,
  GameCardsModule,
  GameLoggerModule,
  GameSettingsModule,
  GameStatsModule,
  MapEuropeModule,
  OutcomeModule,
  PlayersModule,
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
     HUDActionsModule,
     GameCardsModule,
     GameLoggerModule,
     GameSettingsModule,
     GameStatsModule,
     MapEuropeModule,
     OutcomeModule,
     PlayersModule,
     TimerModule
  ]
})

export class SessionModule { }
