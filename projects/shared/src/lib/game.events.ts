import { of, EMPTY } from 'rxjs';
import { Session, ArmyType, Army, Area, SeasonEvent, GameEvent } from './interfaces';
import { Injectable } from '@angular/core';

import { GameCache } from './game.cache';
import { isAreaOwnedByMe, isMyTurnFromSession } from './helpers';

@Injectable({
  providedIn: 'root'
})

export class GameEvents {

  constructor(
    private cache: GameCache
  ) {}

  season(session: Session) {

    switch (session.state.currentSeason) {
      case 0:
        return this.seasonEvent(session, SeasonEvent.Winter, GameEvent.WinterOutcome);
      case 1:
        return of(null);
      case 2:
        return this.seasonEvent(session, SeasonEvent.Summer, GameEvent.SummerOutcome);
      case 3:
        return this.seasonEvent(session, SeasonEvent.Autumn, GameEvent.AutumnOutcome);
    }
  }

  seasonEvent(session: Session, seasonEvent: SeasonEvent, outcomeEvent: GameEvent.WinterOutcome | GameEvent.SummerOutcome | GameEvent.AutumnOutcome) {

    const affectedAreas = [];

    const updatedSession = this.iterateOwnAreas(session, seasonEvent, (area: Area) => {

      // Lose 30% of your armies each turn while winter is active
      area = this.performSeasonEvent(area);

      // Storing affected areas to avoid making the same if
      // check after the session has been stored with the updates
      affectedAreas.push(area);

      return area;
    });

    return of({
      session: updatedSession,
      affectedAreas,
      emitEvent: outcomeEvent
    });
  }

  private killArmies(area: Area, armyType: ArmyType) {
    return Math.ceil(((area.state.armies[armyType] as Army).amount / 100) * 20); // 20% are lost (rounded up)
  }

  private setToMinimumZero(area: Area) {

    const armies = {...area.state.armies};

    for (const armyType in armies) {
      const army = armies[armyType] as Army;
      army.amount = army.amount || 0;
    }

    return armies;
  }

  private performSeasonEvent(area: Area): Area {

    const _area = {...area};

    _area.state.armies.soldiers.amount -= this.killArmies(_area, ArmyType.Soldiers);
    _area.state.armies.horses.amount -= this.killArmies(_area, ArmyType.Horses);
    _area.state.armies.gatlingGuns.amount -= this.killArmies(_area, ArmyType.GatlingGuns);
    _area.state.armies.spies.amount -= this.killArmies(_area, ArmyType.Spies);
    _area.state.armies = this.setToMinimumZero(_area);

    return _area;
  }

  private iterateOwnAreas(session: Session, seasonEvent: SeasonEvent, action: (area: Area) => Area) {

    const _session = {...session};

    _session.state.map.areas = _session.state.map.areas.map((area) => {

      // NOTE: Do not check the __ui.isOwnedBySelf property
      // as its not yet updated when it comes to this point
      // since event is a different observable alongside
      // the session updated observable.
      if (isMyTurnFromSession(_session, this.cache.clientId) && isAreaOwnedByMe(this.cache.clientId, area) && area.events[seasonEvent]) {
        area = action(area);
      }

      return area;
    });

    return _session;
  }
}