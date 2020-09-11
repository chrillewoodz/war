import { environment } from '../../environments/environment';
import { AfterViewInit, Component, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, merge, interval, EMPTY, of, Subject, from } from 'rxjs';
import { takeUntil, map, tap, first, filter, switchMap, concatMap, delay, finalize } from 'rxjs/operators';

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
  SeasonEventData,
  OutcomeData,
  HUDCardsService,
  CardIDs,
  Player
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

  public mapType = 'europe';
  public elapsedTime = 0;
  public isMyTurn = false;
  public result: PipeResult;

  private subscriptions = new Subscription();
  private shouldQuitOnDestroy = true;

  constructor(
    private cache: GameCache,
    private cardsService: HUDCardsService,
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
        console.log(this.elapsedTime, result.percent);
        this.elapsedTime = result.percent;
      }, (err) => {
        console.log(err);
      }
    );

    const eventSub = this.socketApi.event(false)
      .pipe(
        switchMap((e) => {

          switch (e.eventName) {
            case GameEvent.Attack:

              const data = e.data as OutcomeData<{self: Player, __outcome: {success: boolean}}>;

              if (data.extras.self.clientId !== this.cache.self.clientId) {

                const success = data.extras.__outcome.success;

                this.emitWithDelay(data.affectedAreas, 250, (area) => {

                  this.mapEngine.loadOutcome({
                    area: area,
                    image: `assets/SVG/${data.extras.self.extras.faction.flag}`,
                    title: {
                      color: success ? '#08c339' : 'red',
                      label: success ? 'Attack successful' : 'Attack failed'
                    },
                    messages: [
                      { color: 'white', label: `${data.extras.self.extras.faction.name} ${success ? 'successfully launched an attack on' : 'failed the attack on'} ${area.name}` }
                    ]
                  });
                });
              }
              return EMPTY;
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

              this.emitWithDelay((e.data as OutcomeData).affectedAreas, 250, (area) => {

                this.mapEngine.loadOutcome({
                  area: area,
                  image: 'assets/SVG/winter.svg',
                  title: {
                    color: '#82D0D3',
                    label: 'Winter'
                  },
                  messages: [
                    { color: 'white', label: 'Armies start to freeze to death' }
                  ]
                });
              });
              return EMPTY;
            case GameEvent.SummerOutcome:

              this.emitWithDelay((e.data as OutcomeData).affectedAreas, 250, (area) => {

                this.mapEngine.loadOutcome({
                  area: area,
                  image: 'assets/SVG/summer.svg',
                  title: {
                    color: '#FFBE6A',
                    label: 'Summer'
                  },
                  messages: [
                    { color: 'white', label: 'Armies start dying from dehydration' }
                  ]
                });
              });
              return EMPTY;
            case GameEvent.AutumnOutcome:

              this.emitWithDelay((e.data as OutcomeData).affectedAreas, 250, (area) => {

                this.mapEngine.loadOutcome({
                  area: area,
                  image: 'assets/SVG/autumn.svg',
                  title: {
                    color: '#B48400',
                    label: 'Autumn'
                  },
                  messages: [
                    { color: 'white', label: 'Massive floods causes armies to drown' }
                  ]
                });
              });
              return EMPTY;
            case GameEvent.PandemicOutcome:

              this.emitWithDelay((e.data as OutcomeData).affectedAreas, 250, (area) => {

                this.mapEngine.loadOutcome({
                  area,
                  image: 'assets/SVG/grim-reaper.svg',
                  title: {
                    color: 'red',
                    label: this.cardsService.getCard(CardIDs.pandemic).config.title
                  },
                  messages: [
                    { color: 'white', label: 'Death, only death...' }
                  ]
                });
              });

              return EMPTY;
            case GameEvent.BubonicPlagueOutcome:

              this.emitWithDelay((e.data as OutcomeData).affectedAreas, 250, (area) => {

                this.mapEngine.loadOutcome({
                  area,
                  image: 'assets/SVG/plague-doctor.svg',
                  title: {
                    color: 'red',
                    label: this.cardsService.getCard(CardIDs.bubonicPlague).config.title
                  },
                  messages: [
                    { color: 'white', label: `No one saw it coming...` }
                  ]
                });
              });
              return EMPTY;
            case GameEvent.FamineOutcome:

              this.emitWithDelay((e.data as OutcomeData).affectedAreas, 250, (area) => {

                this.mapEngine.loadOutcome({
                  area,
                  image: 'assets/SVG/human-skull.svg',
                  title: {
                    color: 'red',
                    label: this.cardsService.getCard(CardIDs.famine).config.title
                  },
                  messages: [
                    { color: 'white', label: 'Hunger... and death.' }
                  ]
                });
              });
              return EMPTY;
            case GameEvent.PoisonFoodStoragesOutcome:

              this.emitWithDelay((e.data as OutcomeData).affectedAreas, 250, (area) => {

                this.mapEngine.loadOutcome({
                  area,
                  image: 'assets/SVG/human-skull.svg', // TODO: Change image
                  title: {
                    color: '#8fb239',
                    label: this.cardsService.getCard(CardIDs.poisonFoodStorages).config.title
                  },
                  messages: [
                    { color: 'white', label: `Armies die within minutes...` }
                  ]
                });
              });
              return EMPTY;
            case GameEvent.ResistanceOutcome:

              this.emitWithDelay((e.data as OutcomeData).affectedAreas, 250, (area) => {

                this.mapEngine.loadOutcome({
                  area,
                  image: 'assets/SVG/resistance.svg',
                  title: {
                    color: '#08c339',
                    label: this.cardsService.getCard(CardIDs.resistance1).config.title // doesn't matter which version of the card here, title is the same
                  },
                  messages: [
                    { color: 'white', label: 'Government overthrown...' }
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
          this.cache.setSession(result.session); // Want the last session state for the summary page
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

  onEnded() {
    this.shouldQuitOnDestroy = false;
    this.router.navigateByUrl('/summary');
  }

  onError() {
    this.shouldQuitOnDestroy = false;
    this.router.navigateByUrl('/error');
  }

  emitWithDelay(areas: Area[], delayBy: number, onEmit: (area: Area) => void) {

    const sub = new Subject();

    from(areas)
      .pipe(
        takeUntil(sub),
        concatMap(val => of(val).pipe(
          delay(delayBy),
          first()
        )),
        finalize(() => sub.next())
      )
      .subscribe((area) => {
        onEmit(area);
      }
    );
  }
}
