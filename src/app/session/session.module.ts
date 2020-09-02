import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { SessionComponent } from './session.component';

import {
  DirectivesModule,
  ActionPointsModule,
  HUDActionsModule,
  HUDPlayersModule,
  HUDTimerModule,
  HUDCardsModule,
  HUDLoggerModule,
  HUDSettingsModule,
  HUDStatsModule,
  MapEuropeModule,
  OutcomeModule
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
     HUDPlayersModule,
     HUDTimerModule,
     HUDCardsModule,
     HUDLoggerModule,
     HUDSettingsModule,
     HUDStatsModule,
     MapEuropeModule,
     OutcomeModule
  ]
})

export class SessionModule { }
