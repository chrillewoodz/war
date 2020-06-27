import { AreaPopupService } from './area-popup/area-popup.service';
import { AreaStatsService } from './area-information/area-stats.service';
import { GameCache } from './game.cache';
import { tap, map, filter, first } from 'rxjs/operators';
import { Injectable, Renderer2, RendererFactory2, ElementRef, Pipe } from '@angular/core';
import { Areas, MapEuropeConfig } from './map-europe/map-europe.config';
import { ReplaySubject } from 'rxjs';
import { PipeResult, Area, SelectedEvent } from './interfaces';
import { isMyTurn, isOccupiedByMe } from './helpers';

@Injectable({
  providedIn: 'root'
})

export class MapEngine {

  public readonly areaSelector = '.cls-1';

  private areas = new ReplaySubject<Area[]>(1);
  private activeAreas = new ReplaySubject<Element[]>(1);
  private selected = new ReplaySubject<SelectedEvent>(1); // areaId
  private connection = new ReplaySubject<number>(1); // areaId
  private renderer: Renderer2;

  public areas$ = this.areas.asObservable();
  public activeAreas$ = this.activeAreas.asObservable();
  public selected$ = this.selected.asObservable().pipe(
    map(({ mouseEvent, areas, area }) => {

      if (area) {
        return {
          areas,
          area,
          mouseEvent,
          areaEl: this.queryArea(area.areaId),
        } as SelectedEvent;
      }
      else {
        return null;
      }
    })
  );
  public connection$ = this.connection.asObservable();

  constructor(
    private aps: AreaPopupService,
    private ass: AreaStatsService,
    private cache: GameCache,
    private rendererFactory: RendererFactory2
  ) {

    this.renderer = this.rendererFactory.createRenderer(null, null);

    this.selected$.pipe(
      map((e) => {

        return {
          ...e,
          areas: e.areas.map((area) => {

            if (area.state.isSelected && !area.state.isOwnedBySelf) {
              console.log(area, area.state.isSelected, area.state.isOwnedBySelf)
              area.state.isSelected = false;
            }

            return area;
          })
        }
      }),
      tap(({ mouseEvent, areas, area}) => {

        if (area?.state.isOwnedBySelf && !area?.state.isSelected) {
          this.selectArea(areas, area);
        }
        else if (area?.state.isConnectedToSelected) {
          this.selectConnection(areas, area);
        }

        this.ass.show({
          country: area?.name,
          occupiedBy: area?.state.occupiedBy
        });

        this.aps.show({
          mouseEvent,
          area
        });
      })
    ).subscribe(({ areas }) => {

      // if (selected) {

      //   selected.area.state.isSelected = true;
      //   // this.addSelectedClass(selected.areaEl);

      //   if (this.queryOwnedSelectedArea() === selected.areaEl) {
      //     this.renderConnections(selected.area);
      //   }

      //   // this.getActiveAreas();
      // }
      // else {
      //   // this.clearRenderedConnections();
      //   // this.removeOwnedSelectedClass(); // NOTE: Has to be removed after
      // }

      this.activeAreas.next(this.queryActiveAreas());
      this.areas.next(areas);
    });

    this.connection$.pipe(
      map((areaId) => {

        if (areaId) {
          return {
            areaEl: this.queryArea(areaId),
            area: this.cache.getAreaById(areaId)
          };
        }
        else {
          return null;
        }
      })
    ).subscribe((selected) => {

      if (selected) {
        this.removeConnectionSelectedClass();
        this.addSelectedClass(selected.areaEl);
      }
      else {
        this.removeConnectionSelectedClass();
      }
    });
  }

  setSelected(e: SelectedEvent) {
    this.selected.next(e);
  }

  clearSelected() {
    this.selected.next(null);
  }

  setConnection(areaId: number) {
    this.connection.next(areaId);
  }

  clearConnection() {
    this.connection.next(null);
  }

  selectArea(areas: Area[], area: Area) {

    if (area.state.isOwnedBySelf) {
      area.state.isSelected = true;

      MapEuropeConfig[area.areaId].connections.forEach((connectionId) => {

        const state = areas[connectionId].state;
        state.isActive = true;
        state.isConnectedToSelected = true;
      });
    }
  }

  deselectArea(area: Area) {
    area.state.isSelected = false;
  }

  selectConnection(areas: Area[], area: Area) {
    area.state.isSelected = true;
    this.areas.next(areas);
  }

  prepareMap(areaPoints: string[], config: Areas) {
    console.log('preparing map')
    const areas: Area[] = areaPoints.map((points, areaId) => {

      return {
        areaId,
        points,
        name: config[areaId].name,
        isStartingArea: config[areaId].isStartingArea,
        state: {
          occupiedBy: null,
          armies: {
            soldiers: null,
            horses: null,
            gatlingGuns: null,
            spies: null
          },
          isActive: false,
          isSelected: false,
          isConnectedToSelected: false,
          isOwnedBySelf: false
        }
      }
    });

    this.areas.next(areas);
  }

  // mapReady(elementRef: ElementRef) {

  //   const areas: HTMLElement[] = Array.from(elementRef.nativeElement.querySelectorAll(this.areaSelector));
  //   const config = MapEuropeConfig; // TODO: Make this dynamic

  //   this.attachData(areas, config);
  //   this.areas.next(areas);
  // }

  // TODO: Create config type
  // private attachData(areas: HTMLElement[], config: any) {

  //   areas.forEach((el, i) => {
  //     this.renderer.setAttribute(el, 'data-area-id', String(i));
  //     this.renderer.setAttribute(el, 'data-is-starting-area', String(!!config[i].isStartingArea));
  //   });
  // }

  updateMap(result: PipeResult) {

    // Don't set area UI-related states on the stored areas
    const areas = [...result.session.state.areas];

    areas.forEach((area) => {

      if (isOccupiedByMe(result, area) && isMyTurn(result)) {
        area.state.isActive = true;
        area.state.isOwnedBySelf = true;
      }
    });

    this.areas.next(areas);
  }

  private addSelectedClass(area: HTMLElement) {
    this.renderer.addClass(area, 'selected');
  }

  // private removeOwnedSelectedClass() {

  //   const selectedArea = this.queryOwnedSelectedArea();

  //   if (selectedArea) {
  //     selectedArea.classList.remove('selected');
  //   }
  // }

  private removeConnectionSelectedClass() {

    const selectedArea = this.queryConnectionSelectedArea();

    if (selectedArea) {
      selectedArea.classList.remove('selected');
    }
  }

  // private renderFill(area: HTMLElement, color: string) {
  //   this.renderer.setStyle(area, 'fill', color);
  // }

  private renderConnections(area: Area) {

    MapEuropeConfig[area.areaId].connections.forEach((connectionId) => {
      const areaEl = this.queryArea(connectionId);
      this.renderer.addClass(areaEl, 'active');
      this.renderer.addClass(areaEl, 'connection');
    });
  }

  private clearRenderedConnections() {

    // this.areas.pipe(
    //   first()
    // )
    // .subscribe((areas) => {

    //   areas.forEach((area) => {

    //     const classes = area.classList;

    //     if (!classes.contains('selected') && !classes.contains('owned')) {
    //       this.renderer.removeClass(area, 'active');
    //     }
    //     else if (classes.contains('connection')) {
    //       this.renderer.removeClass(area, 'active');
    //     }
    //   });
    // });
  }

  // private queryAreas() {
  //   return Array.from(document.querySelectorAll('.map-container polygon'));
  // }

  private queryActiveAreas() {
    return Array.from(document.querySelectorAll('.map-container polygon.active'));
  }

  private queryArea(areaId: number): HTMLElement {
    return document.querySelector(`[data-area-id="${areaId}"]`);
  }

  private queryOwnedSelectedArea(): HTMLElement {
    return document.querySelector(`.map-container polygon.owned.selected`);
  }

  private queryConnectionSelectedArea(): HTMLElement {
    return document.querySelector(`.map-container polygon.connection.selected`);
  }
}