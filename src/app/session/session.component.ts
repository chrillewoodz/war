import { Component, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { timer, Subscription, merge, of } from 'rxjs';
import { takeUntil, map, take, tap, switchMap, catchError } from 'rxjs/operators';

import {
  MapEngine,
  MapEuropeComponent,
  SocketResponse,
  GameCache,
  Session,
  Player,
  Area,
  GameEngine,
  GameEngineEvent,
  SocketApi,
  PipeResult
} from 'shared';

import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})

export class SessionComponent implements OnDestroy {
  @ViewChild('mapInstance') map: MapEuropeComponent;

  public isFightActive = false;

  public config = {
    total: 25,
    actionsLeft: 12,
    actionCost: 3
  }

  public stats = {
    totalTerritories: 32,
    ownedTerritories: 3,
    ownedArmies: {
      soldiers: 12,
      horses: 7,
      gatlinGuns: 2,
      spies: 3,
      idleArmies: 8
    }
  }

  // public players: Players = {
  //   '1': Sweden,
  //   '2': China,
  //   '3': Somalia,
  //   '4': Germany
  // };

  // public playerState = {
  //   areas: [36, 13],
  //   colorRGB: this.players['1'].colorRGB
  // };

  public cards = [
    { img: 'soldier', title: 'An unexpected ally', action: () => {
      console.log('reinforcements coming!');
    }},
    { img: 'horse', title: 'Call in the cavalry', action: () => {
      console.log('Cavalry incoming!');
    }},
    { img: 'spy', title: 'Espionage', action: () => {
      console.log('Spies deployed!');
    }},
    { img: 'gatling-gun', title: 'Unleash hell', action: () => {
      console.log('Unleasing hell...');
    }},
    { img: 'soldier', title: 'Convert workers', action: () => {
      console.log('Workers converted to soliders!');
    }}
  ];

  public currentFight = {
    attacker: {
      name: 'Josef Stalin',
      troops: {
        soldiers: 5,
        horses: 2,
        gatlinGuns: 1
      }
    },
    defender: {
      name: 'Benjamin Franklin',
      troops: {
        soldiers: 3,
        horses: 1,
        gatlinGuns: 0
      }
    }
  }

  public mapType = 'europe';
  public activeAreas: HTMLElement[];
  public areas: HTMLElement[];
  public timePerRound = 90000;
  public totalTerritories = 32;

  public timer$ = timer(1000, 1000)
    .pipe(
      map((t) => (1 + t) * 1000),
      take(this.timePerRound / 1000)
    );

  public session: Session;
  public self: Player;

  private subscriptions = new Subscription();

  constructor(
    private cd: ChangeDetectorRef,
    private cache: GameCache,
    private gameEngine: GameEngine,
    private mapEngine: MapEngine,
    private socket: Socket,
    private socketApi: SocketApi
  ) {

    const activeAreasSub = this.mapEngine.activeAreas$.subscribe((activeAreas) => {
      this.activeAreas = activeAreas;
    });

    const sessionSub = merge(
      this.socketApi.get(true),
      this.socketApi.join(false),
      this.socketApi.quit(false),
      this.socketApi.preUpdate(false)
    )
    .pipe(
      takeUntil(this.gameEngine.listen(GameEngineEvent.Start)),
      switchMap((result) => {

        if (result.session.state.areasReady) {
          return of(result);
        }

        return this.mapEngine.areas$.pipe(
          map<HTMLElement[], Area[]>((areas) => areas.map((area) => {
            return {
              areaId: area.dataset.areaId,
              state: {
                occupiedBy: null,
                troops: {
                  soldiers: null,
                  horses: null,
                  gatlingGuns: null,
                  spies: null
                }
              }
            };
          })),
          map<Area[], PipeResult>((areas: Area[]) => {

            return {
              ...result, // self is included here
              session: {
                ...result.session,
                state: {
                  ...result.session.state,
                  areas,
                  areasReady: true
                }
              }
            };
          }),
          tap((result) => this.update(result.session))
        );
      })
    )
    .subscribe((result) => {
      this.session = result.session;
      this.self = result.self;

      if (Object.keys(result.session.state.players).length >= 2) {
        this.gameEngine.setReadyState(true);
      }

      console.log(this.session, this.self);
    }, (err) => {
      console.log(err);
    });

    const ongoingSessionSub = merge(
      this.socketApi.quit(false),
      this.socketApi.update(false)
    )
    .subscribe((result) => {
      this.session = result.session;
      this.self = result.self;
    });

    this.subscriptions.add(activeAreasSub);
    this.subscriptions.add(sessionSub);
    this.subscriptions.add(ongoingSessionSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {

    // TODO: Move to "dynamic" place
    // this.mapEngine.renderActiveAreas(MapEuropeConnections, this.playerState?.areas);
    // this.mapEngine.renderPlayerAreas(this.playerState?.areas, this.playerState?.colorRGB);
  }

  endTurn() {
    console.log('turn ended');
  }

  initFight() {
    this.isFightActive = true;
  }

  fightCompleted(e) {
    this.isFightActive = false;
    console.log('fight completed');
  }

  onMapReady(e) {
    this.areas = e.areas;
    this.cd.detectChanges();
  }

  update(session) {
    this.socket.emit('pre_game_update', { sessionId: session.sessionId, newState: session.state });
    console.log('updating..')
  }
}
