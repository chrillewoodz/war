import { Component, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { interval, timer, Subscription, throwError, combineLatest, merge } from 'rxjs';
import { takeUntil, map, startWith, take, tap, switchMap, first, finalize } from 'rxjs/operators';

import {
  MapEngine,
  MapEuropeComponent,
  MapEuropeConnections,
  Sweden,
  China,
  Somalia,
  Germany,
  SocketEvent,
  GameCache,
  factionsAsArray,
  attachFactions,
  getSelf
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

  public session;
  public self;

  private subscriptions = new Subscription();

  constructor(
    private cd: ChangeDetectorRef,
    private cache: GameCache,
    private mapEngine: MapEngine,
    private router: Router,
    private socket: Socket
  ) {

    const areasSub = this.mapEngine.areas$.subscribe((areas) => {
      this.areas = areas;
    });

    const activeAreasSub = this.mapEngine.activeAreas$.subscribe((activeAreas) => {
      this.activeAreas = activeAreas;
    });

    this.socket.emit('get', { sessionId: this.cache.sessionId });

    const sessionSub =
      merge(
        this.socket.fromEvent<SocketEvent>('get_success'),
        this.socket.fromEvent<SocketEvent>('join_success'),
        this.socket.fromEvent<SocketEvent>('session_update')
      )
      .pipe(
        map((response) => {
          console.log(response);
          switch (response.status) {
            case 200: return response;
            default: throwError(response.err).pipe(
              first(),
              finalize(() => {
                this.router.navigateByUrl('');
              })
            );
          }
        }),
        map((response) => attachFactions(response.res)),
        map((session) => {
          return { state: session, self: getSelf(session, this.cache.clientId) }
        })
      )
      .subscribe((session) => {
        this.session = session.state;
        this.self = session.self;
        console.log(this.session, this.self);
      }, (err) => {
        console.log(err);
      });

    this.subscriptions.add(areasSub);
    this.subscriptions.add(activeAreasSub);
    this.subscriptions.add(sessionSub);
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
}
