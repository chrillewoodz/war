import { Injectable, Renderer2, RendererFactory2, ElementRef } from '@angular/core';
import { Areas } from './map-europe/map-europe.connections';
import { ReplaySubject } from 'rxjs';

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

    this.attachAreaIds(areas);
    this.areas.next(areas);
  }

  attachAreaIds(areas: HTMLElement[]) {

    areas.forEach((el, i) => {
      this.renderer.setAttribute(el, 'data-area-id', String(i));
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