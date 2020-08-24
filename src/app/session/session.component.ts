import { environment } from '../../environments/environment';
import { AfterViewInit, Component, ChangeDetectorRef, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, merge, interval, EMPTY, NEVER } from 'rxjs';
import { takeUntil, map, tap, first, filter, switchMap } from 'rxjs/operators';

import {
  MapEngine,
  MapEuropeComponent,
  GameCache,
  Area,
  GameEngine,
  GameEngineEvent,
  GameEvent,
  SocketApi,
  PipeResult,
  isMyTurn,
  OutcomeDirective,
  TimerResponse,
  GameEvents,
  exhaust,
  SeasonEvent,
  SeasonEventData,
  SeasonOutcomeData,
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
    private gameEvents: GameEvents,
    private mapEngine: MapEngine,
    private router: Router,
    private socketApi: SocketApi,
  ) {

    document.addEventListener('click', (e) => {

      if (this.gameEngine.isBlocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    const mapInitSub = this.mapEngine.init().subscribe((event) => {

      this.socketApi.update(true, {
        map: {
          areas: event.areas
        }
      });
    });

    // Used to remove dead games, couldn't make it happen with a simple window refresh/close
    // since it's really difficult to detect that whilst covering all cases and browsers.
    // We just indicate to the backend that we're still active as long as this runs.
    const activeEmitter = interval(10000)
      .pipe(
        takeUntil(this.gameEngine.listen(GameEngineEvent.Stop))
      )
      .subscribe(() => {
        this.socketApi.isActive();
      }
    );

    // Don't restart on refresh/load in production
    const turnSub = this.socketApi.timer<TimerResponse>()
      .subscribe((result) => {
        this.elapsedTime = result.percent;
      }, (err) => {
        console.log(err);
      }
    );

    const eventSub = this.socketApi.event(false)
      .pipe(
        switchMap((e) => {

          switch (e.eventName) {
            case GameEvent.Season:
              return this.gameEvents.season((e.data as SeasonEventData).session).pipe(
                first(),
                filter((seasonEvent) => !!seasonEvent), // Spring is null atm so won't fire an event
                switchMap((seasonEvent) => this.socketApi.update(true, seasonEvent.session.state).pipe(
                  first(),
                  tap(() => {

                    // Emit to server which will then emit to all clients
                    // and trigger outcomes for each one
                    this.socketApi.event(true, seasonEvent.emitEvent, {
                      affectedAreas: seasonEvent.affectedAreas
                    })
                  })
                ))
              );
            case GameEvent.WinterOutcome:

              (e.data as SeasonOutcomeData).affectedAreas.forEach((area) => {

                this.mapEngine.loadOutcome({
                  area: area,
                  image: 'assets/SVG/winter.svg',
                  title: {
                    color: '#82D0D3',
                    label: 'Winter'
                  },
                  messages: [
                    { color: 'white', label: 'Frostbite sets in' }
                  ]
                });
              });
              return EMPTY;
            case GameEvent.SummerOutcome:

              (e.data as SeasonOutcomeData).affectedAreas.forEach((area) => {

                this.mapEngine.loadOutcome({
                  area: area,
                  image: 'assets/SVG/summer.svg',
                  title: {
                    color: '#82D0D3',
                    label: 'Summer'
                  },
                  messages: [
                    { color: 'white', label: 'Dehydration sets in' }
                  ]
                });
              });
              return EMPTY;
            case GameEvent.AutumnOutcome:

              (e.data as SeasonOutcomeData).affectedAreas.forEach((area) => {

                this.mapEngine.loadOutcome({
                  area: area,
                  image: 'assets/SVG/autumn.svg',
                  title: {
                    color: '#82D0D3',
                    label: 'Autumn'
                  },
                  messages: [
                    { color: 'white', label: 'Rain causes floods' }
                  ]
                });
              });
              return EMPTY;
            default:
              exhaust(e.eventName);
              return EMPTY;
          }
        })
      )
      .subscribe();

    const sessionSub = merge(
      this.socketApi.get(true),
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
        result.session.state.map.areas = result.session.state.map.areas.map((area) => {
          area.state.__ui = {};
          return area;
        });

        if (result.session.state.started) {
          console.log(2)
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
      // console.log(this.result);
    }, (err) => {
      console.error(err);
      this.onError();
    });

    this.subscriptions.add(mapInitSub);
    this.subscriptions.add(activeEmitter);
    this.subscriptions.add(turnSub);
    this.subscriptions.add(eventSub);
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

  onMapReady(e) {
    this.areas = e.areas;
    this.cd.detectChanges();
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
