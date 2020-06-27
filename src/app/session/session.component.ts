import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Component, ChangeDetectorRef, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { timer, Subscription, merge, of, interval, Observable } from 'rxjs';
import { takeUntil, map, take, tap, switchMap, first, finalize, catchError, filter } from 'rxjs/operators';

import {
  MapEngine,
  MapEuropeComponent,
  GameCache,
  Session,
  Player,
  Area,
  GameEngine,
  GameEngineEvent,
  SocketApi,
  PipeResult,
  isMyTurn,
  TimerResponse,
  MapEuropePolygonPoints,
  MapEuropeConfig
} from 'shared';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})

export class SessionComponent implements OnDestroy {
  @ViewChild('mapInstance') map: MapEuropeComponent;

  @HostListener('window:onbeforeunload')
  onBeforeUnload() {

    // Don't quit on every compile refresh in dev mode, that would be annoying :)
    if (environment.production) {
      this.socketApi.quit(true);
    }
  }

  public isFightActive = false;

  public config = {
    total: 25,
    actionsLeft: 12,
    actionCost: 3
  }

  // public stats = {
  //   totalTerritories: 32,
  //   ownedTerritories: 3,
  //   ownedArmies: {
  //     soldiers: 12,
  //     horses: 7,
  //     gatlingGuns: 2,
  //     spies: 3,
  //     idleArmies: 8
  //   }
  // }

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
        gatlingGuns: 1
      }
    },
    defender: {
      name: 'Benjamin Franklin',
      troops: {
        soldiers: 3,
        horses: 1,
        gatlingGuns: 0
      }
    }
  }

  public mapType = 'europe';
  public activeAreas: Element[];
  public areas: Area[];
  public timePerRound = 5000;
  public totalTerritories = 32;
  public elapsedTime = 0;
  public result: PipeResult;
  public session: Session;
  public self: Player;
  public players: {[clientId: string]: Player};

  private subscriptions = new Subscription();
  private shouldQuitOnDestroy = true;

  constructor(
    private cd: ChangeDetectorRef,
    private cache: GameCache,
    private gameEngine: GameEngine,
    private mapEngine: MapEngine,
    private router: Router,
    private socketApi: SocketApi
  ) {

    // Used to remove dead games, couldn't make it happen with a simple window refresh/close
    // since it's really difficult to detect that whilst covering all cases and browsers.
    // We just indicate to the backend that we're still active as long as this runs.
    const activeEmitter = interval(30000)
      .pipe(
        takeUntil(this.gameEngine.listen(GameEngineEvent.Stop))
      )
      .subscribe(() => {
        this.socketApi.isActive();
      }
    );

    // Don't restart on refresh/load in production
    const turnSub = this.socketApi.timer<TimerResponse>(false)
      .subscribe((result) => {
        this.elapsedTime = result.percent;
      }, (err) => {
        console.log(err);
      }
    );

    const areasSub = this.mapEngine.areas$.subscribe((areas) => {
      this.areas = areas;
      console.log(this.areas);
    });

    const activeAreasSub = this.mapEngine.activeAreas$.subscribe((activeAreas) => {
      this.activeAreas = activeAreas;
    });

    // NOTE: This cannot be used with function keyword
    // or the timer call throws type error.
    const init = (forwardedResult: PipeResult) => {
      console.log('ninitied')
      return new Observable((observer) => {
        return observer.next();
      })
      .pipe(
        first(),
        map(() => forwardedResult),
        tap((result) => {

          if (!environment.production) {

            // NOTE: Decided against populating the percent of the timer
            // in dev mode since it doesn't matter at all and won't be a
            // problem in production since a refresh will cause you to leave the game
            if (isMyTurn(result)) {
              this.socketApi.timer<TimerResponse>(true);
            }
          }

          console.log('preparing mappppp')
          this.mapEngine.prepareMap(MapEuropePolygonPoints, MapEuropeConfig);
        }),
        filter((result) => !result.session.state.started),
        map((result) => {
          console.log('doing stuff')
          let _result = { ...result };
              _result = this.gameEngine.setStartingArmies(_result);

          return _result;
        }),
        tap((result) => {
          this.updateState(result.session.state);
        })
      );
    };

    const sessionSub = merge(
      this.socketApi.get(true).pipe(
        switchMap((result) => {
          console.log(this.cache.initDone);
          if (this.cache.initDone) {
            return of(result);
          }

          return init(result).pipe(
            finalize(() => {
              console.log('hello');
              this.cache.setInitDone();
            })
          );
        })
      ),
      this.socketApi.update(false)
    )
    .pipe(
      filter((result) => {

        if (result.session.state.ended) {
          this.onEnded();
          return false;
        }
        console.log('continuing')
        return true;
      }),
      switchMap((result) => {

        if (result.session.state.areasReady) {
          return of(result);
        }
        console.log('setting areas');
        return this.mapEngine.areas$.pipe(
          map<Area[], PipeResult>((areas) => this.gameEngine.applyAreasToState(result, areas)),
          tap((result) => this.updateState(result.session.state))
        );
      }),
      tap((result) => {

        if (result.session.state.started) {
          this.mapEngine.updateMap(result);
        }
      })
    )
    .subscribe((result) => {
      this.result = result;
      this.session = result.session;
      this.players = result.session.state.players;
      this.self = result.self;
      console.log(this)
    }, (err) => {
      console.error(err);
      this.onError();
    });

    this.subscriptions.add(areasSub);
    this.subscriptions.add(activeEmitter);
    this.subscriptions.add(turnSub);
    this.subscriptions.add(activeAreasSub);
    this.subscriptions.add(sessionSub);
  }

  ngOnDestroy() {

    if (this.shouldQuitOnDestroy) {
      this.socketApi.quit(true).pipe(first()).subscribe();
    }

    this.subscriptions.unsubscribe();
  }

  initFight() {
    this.isFightActive = true;
  }

  fightCompleted(e) {
    this.isFightActive = false;
  }

  onMapReady(e) {
    this.areas = e.areas;
    this.cd.detectChanges();
  }

  updateState(state = this.session.state) {
    console.log('updating state', state);
    this.gameEngine.updateGame(state);
  }

  onEnded() {
    this.shouldQuitOnDestroy = false;
    this.router.navigateByUrl('/summary');
  }

  onError() {
    this.shouldQuitOnDestroy = false;
    this.router.navigateByUrl('/error');
  }
}
