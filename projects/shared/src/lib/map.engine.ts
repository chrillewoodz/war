import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { ReplaySubject, merge, of } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

import { PipeResult, SelectedEvent, Army, OutcomeConfig } from './interfaces';
import { isMyTurn, isOccupiedByMe, getTotalPowerOfArea } from './helpers';
import { GameCache } from './game.cache';
import { DynamicComponent } from './dynamic-component';
import { OutcomeComponent } from './outcome/outcome.component';

@Injectable({
  providedIn: 'root'
})

export class MapEngine {

  public readonly areaSelector = '.cls-1';

  private selected = new ReplaySubject<SelectedEvent>(1); // areaId
  private connection = new ReplaySubject<SelectedEvent>(1); // areaId

  public selected$ = this.selected.asObservable();
  public connection$ = this.connection.asObservable();

  constructor(
    private cache: GameCache,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  init() {

    return of<SelectedEvent>({
      areas: this.cache.session.state.map.areas,
      selected: this.cache.getSelectedArea(),
      selectedConnection: this.cache.getSelectedConnectedArea()
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
                    return total + (((e.selected.state.armies[armyType] as Army).amount as number) || 0);
                  }, 0);

                if (totalArmiesInArea > 0) {

                  e.selected.connections.forEach((connectionId) => {
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
        );
      }),
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
      })
    );
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

    result.session.state.map.areas = result.session.state.map.areas.map((area) => {

      area.state.__ui.screenXY = this.mapToScreenCoordinates(this.cache.mapElement, area.anchorPoints.main.x, area.anchorPoints.main.y);

      if (isOccupiedByMe(result, area) && isMyTurn(result)) {
        area.state.__ui.isOwnedBySelf = true;
        area.state.isActive = true;
      }
      else if (isOccupiedByMe(result, area)) {
        area.state.__ui.isOwnedBySelf = true;
      }

      if (area.state.__ui.isOwnedBySelf || !!area.state.spiedOnBy[this.cache.clientId]) {
        area.state.__ui.power = getTotalPowerOfArea(area);
        area.state.__ui.showPowerOn = true;
      }

      if (area.state.spiedOnBy[this.cache.clientId]) {
        area.state.__ui.isSpiedOnBySelf = true;
      }

      return area;
    });

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
    componentRef.instance.init();
  }
}