import { Directive, HostListener, Renderer2 } from '@angular/core';
import { MapEuropeConnections } from './map-europe/map-europe.connections';
import { AreaStatsService } from './area-information/area-stats.service';

@Directive({
  selector: '[areaHandler]'
})

export class AreaHandlerDirective {

  private previouslyClickedElement: HTMLElement;

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {

    const areaId = (e.target as any).dataset.areaId;

    if (areaId) {
      this.previouslyClickedElement?.classList.remove('selected');
      this.previouslyClickedElement = (e.target as any);
      this.renderer.addClass(e.target, 'selected');
      console.log((e.target as any).dataset.areaId);
      // TODO: Fetch real info
      this.ass.show({
        country: MapEuropeConnections[areaId].name,
        occupiedBy: {
          name: 'USA',
          color: 'rgb(40, 110, 53)'
        },
        troops: {
          soldiers: Math.floor(Math.random() * 50) + 1,
          horses: Math.floor(Math.random() * 30) + 1,
          gatlinGuns: Math.floor(Math.random() * 20) + 1,
          spies: Math.floor(Math.random() * 6) + 1
        }
      })
    }
  }

  constructor(private ass: AreaStatsService, private renderer: Renderer2) {}
}
