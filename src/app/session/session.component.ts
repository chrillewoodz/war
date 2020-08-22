import { environment } from '../../environments/environment';
import { AfterViewInit, Component, ChangeDetectorRef, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, merge, interval } from 'rxjs';
import { takeUntil, map, tap, first, filter } from 'rxjs/operators';

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

    document.addEventListener('click', (e) => {

      if (this.gameEngine.isBlocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    const mapInitSub = this.mapEngine.init().subscribe((event) => {
      this.socketApi.update(true, { areas: event.areas });
    });

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
    const turnSub = this.socketApi.timer<TimerResponse>()
      .subscribe((result) => {
        this.elapsedTime = result.percent;
      }, (err) => {
        console.log(err);
      }
    );

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
        result.session.state.areas = result.session.state.areas.map((area) => {
          area.state.__ui = {};
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
      // console.log(this.result);
    }, (err) => {
      console.error(err);
      this.onError();
    });

    this.subscriptions.add(mapInitSub);
    this.subscriptions.add(activeEmitter);
    this.subscriptions.add(turnSub);
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
