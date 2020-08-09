import { DynamicComponent } from './dynamic-component';
import { OutcomeComponent } from './outcome/outcome.component';
import { Injectable, Renderer2, RendererFactory2, ComponentFactoryResolver } from '@angular/core';
import { ReplaySubject, Subject, merge, Observable, of } from 'rxjs';
import { tap, map, startWith, switchMap, first } from 'rxjs/operators';

import { PipeResult, Area, SelectedEvent, SessionState, Army, OutcomeConfig } from './interfaces';
import { isMyTurn, isOccupiedByMe } from './helpers';
import { SocketApi } from './socket.api';
import { AreaPopupService } from './area-popup/area-popup.service';
import { AreaStatsService } from './area-information/area-stats.service';
import { GameCache } from './game.cache';
import MapEuropeConfig from './map-configs/europe.json';

@Injectable({
  providedIn: 'root'
})

export class MapEngine {

  public readonly areaSelector = '.cls-1';

  private update = new Subject<Partial<SessionState>>();
  private update$ = this.update.asObservable();

  // private areas = new ReplaySubject<Area[]>(1);
  // private activeAreas = new ReplaySubject<Element[]>(1);
  private selected = new ReplaySubject<SelectedEvent>(1); // areaId
  private connection = new ReplaySubject<SelectedEvent>(1); // areaId

  // public areas$ = this.areas.asObservable();
  // public activeAreas$ = this.activeAreas.asObservable();
  public selected$ = this.selected.asObservable();

  public connection$ = this.connection.asObservable();

  constructor(
    private aps: AreaPopupService,
    private ass: AreaStatsService,
    private cache: GameCache,
    private componentFactoryResolver: ComponentFactoryResolver,
    private socketApi: SocketApi
  ) {

    this.update$.subscribe((newState) => {
      this.socketApi.update(true, newState);
    });

    of<SelectedEvent>({
      areas: this.cache.session.state.areas,
      selected: this.cache.getSelectedArea(),
      selectedConnection: this.cache.getSelectedConnectedArea(),
      mouseEvent: this.cache.session.state.lastPopupCoordinates,
      emitUpdateEvent: false
    })
    .pipe(
      tap((e) => {

        if (e.selectedConnection) {
          this.connection.next(e);
        }
        else if (e.selected) {
          this.selected.next(e);
        }
      }),
      switchMap(() => {

        return merge(
          this.selected$.pipe(
            map((e) => {

              if (e.selected.state.__ui.isOwnedBySelf) {

                const totalArmiesInArea = Object.keys(e.selected.state.armies)
                  .reduce((total, armyType) => {
                    return total + (((e.selected.state.armies[armyType] as Army)?.amount as number) || 0);
                  }, 0);

                if (totalArmiesInArea > 0) {

                  MapEuropeConfig[e.selected.areaId].connections.forEach((connectionId) => {

                    const state = e.areas[connectionId].state;
                    state.isActive = true;
                    state.isConnectedToSelected = true;
                  });
                }
              }

              return {...e, area: e.selected};
            })
          ),
          this.connection$.pipe(
            map((e) => {
              return {...e, area: e.selectedConnection};
            })
          )
        )
        .pipe(
          map((e) => {

            e.areas = e.areas.map((area) => {

              // If it's a connected area that's selected
              if (area.state.isConnectedToSelected && area.state.isSelected) {
                area.state.isSelected = false;
              }
              // If it's an owned area that is selected and we're not clicking on a connection
              else if (!area.state.isConnectedToSelected && area.state.isSelected && e.selected && !e.selectedConnection) {
                area.state.isSelected = false;
              }

              if (e.selectedConnection?.areaId === area.areaId || e.selected?.areaId === area.areaId) {
                area.state.isSelected = true;
              }

              return area;
            });

            return e;
          }),
          tap((e) => {

            const hasSelfSpiedOnArea = !!e.area.state.spiedOnBy[this.cache.self.clientId];
            const isAreaOwnedBySelf = e.area.state.occupiedBy?.clientId === this.cache.self.clientId;

            this.ass.show({
              country: e.area?.name,
              occupiedBy: e.area?.state.occupiedBy,
              armies: (hasSelfSpiedOnArea || isAreaOwnedBySelf) ? e.area?.state.armies : null
            });

            this.aps.show(e);
          })
        )
      })
    )
    .subscribe(({ mouseEvent, areas, emitUpdateEvent }) => {

      let lastPopupCoordinates = null;

      if (mouseEvent) {

        lastPopupCoordinates = {
          clientX: mouseEvent.clientX,
          clientY: mouseEvent.clientY
        };
      }

      const newState = {
        areas,
        lastPopupCoordinates
      };

      if (emitUpdateEvent) {
        this.update.next(newState);
      }
    });
  }

  areaClicked(e: SelectedEvent) {

    if (e.selectedConnection) {
      this.connection.next(e);
    }
    else if (e.selected) {
      this.selected.next(e);
    }
  }

  updateMap(result: PipeResult) {

    result.session.state.areas = result.session.state.areas.map((area) => {

      if (isOccupiedByMe(result, area) && isMyTurn(result)) {
        area.state.__ui.isOwnedBySelf = true;
        area.state.isActive = true;
      }
      else if (isOccupiedByMe(result, area)) {
        area.state.__ui.isOwnedBySelf = true;
      }

      return area;
    });

    const cachedSelectedArea = this.cache.getSelectedArea();
    const cachedSelectedConnectionArea = this.cache.getSelectedConnectedArea();

    if (!cachedSelectedConnectionArea && !cachedSelectedArea) {
      this.ass.reset();
    }

    return result;
  }

  mapToScreenCoordinates(mapElement: SVGSVGElement, svgX, svgY) {
    var p = mapElement.createSVGPoint();
     p.x = svgX;
     p.y = svgY;
     return p.matrixTransform(mapElement.getScreenCTM());
  }

  screenToSVGCoordinates(mapElement: SVGSVGElement, svgX, svgY) {
    var p = mapElement.createSVGPoint();
     p.x = svgX;
     p.y = svgY;
     return p.matrixTransform(mapElement.getScreenCTM().inverse());
  }

  loadOutcome(config: OutcomeConfig) {

    const outcomeComponent = new DynamicComponent(OutcomeComponent);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(outcomeComponent.component);
    const viewContainerRef = this.cache.outcomeViewContainerRef;

    const componentRef = viewContainerRef.createComponent<OutcomeComponent>(componentFactory);

    // Pass componentRef so we can self destruct the component
    componentRef.instance.componentRef = componentRef;
    componentRef.instance.config = config;
  }
}