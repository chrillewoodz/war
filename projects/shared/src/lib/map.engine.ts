import { Injectable, Renderer2, RendererFactory2, ElementRef } from '@angular/core';
import { Areas, MapEuropeConfig } from './map-europe/map-europe.config';
import { ReplaySubject } from 'rxjs';
import { PipeResult, Area } from './interfaces';

@Injectable({
  providedIn: 'root'
})

export class MapEngine {

  public readonly areaSelector = '.cls-1';

  private areas = new ReplaySubject<HTMLElement[]>(1);
  private activeAreas = new ReplaySubject<HTMLElement[]>(1);
  private renderer: Renderer2;

  public areas$ = this.areas.asObservable();
  public activeAreas$ = this.activeAreas.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  mapReady(elementRef: ElementRef) {

    const areas: HTMLElement[] = Array.from(elementRef.nativeElement.querySelectorAll(this.areaSelector));
    const config = MapEuropeConfig; // TODO: Make this dynamic

    this.attachData(areas, config);
    this.areas.next(areas);
  }

  // TODO: Create config type
  attachData(areas: HTMLElement[], config: any) {

    areas.forEach((el, i) => {
      this.renderer.setAttribute(el, 'data-area-id', String(i));
      this.renderer.setAttribute(el, 'data-is-starting-area', String(!!config[i].isStartingArea));
    });
  }

  update(result: PipeResult) {

    const areas = result.session.state.areas;

    areas.forEach((area) => {

      const areaEl = this.queryArea(area.areaId);

      if (area.state.occupiedBy) {
        this.renderFill(areaEl, area.state.occupiedBy.extras.faction.colorRGB);
      }

      if (area.state.occupiedBy?.clientId === result.self.clientId) {
        this.renderConnections(area);
        this.renderer.addClass(areaEl, 'active');
      }
    });
  }

  renderFill(area: HTMLElement, color: string) {
    this.renderer.setStyle(area, 'fill', color);
  }

  renderConnections(area: Area) {

    MapEuropeConfig[area.areaId].connections.forEach((connectionId) => {
      const areaEl = this.queryArea(connectionId);
      this.renderer.addClass(areaEl, 'active');
    });
  }

  renderActiveAreas(connections: Areas, areas: number[]) {

    const activeAreas = [];

    areas.forEach((id) => {

      const ownedArea = this.queryArea(id);
      this.renderer.addClass(ownedArea, 'owned');
      this.renderer.addClass(ownedArea, 'active');
      activeAreas.push(ownedArea);

      connections[id].connections.forEach((connectionId) => {
        const connectedArea = this.queryArea(connectionId);
        this.renderer.addClass(connectedArea, 'active');
        activeAreas.push(connectedArea);
      });
    });

    this.activeAreas.next(activeAreas);
  }

  renderPlayerAreas(areaIds: number[], color: string) {

    areaIds.forEach((id) => {
      this.renderer.setStyle(this.queryArea(id), 'fill', color);
    });
  }

  private queryArea(areaId: number): HTMLElement {
    return document.querySelector(`[data-area-id="${areaId}"]`);
  }
}