import { environment } from '../../environments/environment';
import { AfterViewInit, Component, ChangeDetectorRef, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, merge, of, interval, Observable } from 'rxjs';
import { takeUntil, map, tap, switchMap, first, finalize, filter } from 'rxjs/operators';

import {
  MapEngine,
  MapEuropeComponent,
  GameCache,
  Area,
  GameEngine,
  GameEngineEvent,
  SocketApi,
  PipeResult,
  isMyTurn,
  OutcomeDirective,
  TimerResponse,
} from 'shared';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})

export class SessionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapInstance') map: MapEuropeComponent;
  @ViewChild(OutcomeDirective, {static: true}) ocHost: OutcomeDirective;

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
  public isMyTurn = false;
  public result: PipeResult;

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

    // NOTE: This cannot be used with function keyword
    // or the timer call throws type error.
    const init = (forwardedResult: PipeResult) => {

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
        }),
        // filter((result) => !result.session.state.started),
        // map((result) => {

        //   result.session.state.areas = result.session.state.areas.map((area) => {

        //     if (!area.state.__ui) {
        //       area.state.__ui = {};
        //       console.log(area);
        //     }

        //     return area;
        //   });

        //   return result;
        // })
      );
    };

    const sessionSub = merge(
      this.socketApi.get(true).pipe(
        switchMap((result) => {

          if (this.cache.initDone) {
            return of(result);
          }

          return init(result).pipe(
            finalize(() => {
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

        return true;
      }),
      map((result) => {

        // Each time a new result is fetched we need to re-initalize the __ui state
        result.session.state.areas = result.session.state.areas.map((area) => {

          if (!area.state.__ui) {
            area.state.__ui = {};
          }

          return area;
        });

        if (result.session.state.started) {
          result = this.mapEngine.updateMap(result);
        }

        return result;
      }),
      tap((result) => {
        this.cache.setSession(result.session);
        this.isMyTurn = isMyTurn(result);
      })
    )
    .subscribe((result) => {
      this.result = result;
      console.log(this.result);
    }, (err) => {
      console.error(err);
      this.onError();
    });

    // this.subscriptions.add(areasSub);
    this.subscriptions.add(activeEmitter);
    this.subscriptions.add(turnSub);
    // this.subscriptions.add(activeAreasSub);
    this.subscriptions.add(sessionSub);
  }

  ngAfterViewInit() {
    this.cache.setOutcomeHost(this.ocHost.viewContainerRef);
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

  updateState(state = this.result.session.state) {
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
