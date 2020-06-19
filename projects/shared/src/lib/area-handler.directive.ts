import { Directive, HostListener, Renderer2 } from '@angular/core';
import { MapEuropeConfig } from './map-europe/map-europe.config';
import { AreaStatsService } from './area-information/area-stats.service';

@Directive({
  selector: '[areaHandler]'
})

export class AreaHandlerDirective {

  private previouslyClickedElement: HTMLElement;

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {

    const target: HTMLElement = e.target as HTMLElement;
    const areaId = target.dataset.areaId;

    if (areaId && target.classList.contains('active')) {
      console.log(areaId);
      this.onActiveAreaClick(target, areaId);
    }
    else {
      this.onNonActiveAreaClick();
    }
  }

  constructor(private ass: AreaStatsService, private renderer: Renderer2) {}

  onActiveAreaClick(target, areaId) {

    this.onNonActiveAreaClick();
    this.previouslyClickedElement = target;
    this.renderer.addClass(target, 'selected');

    // TODO: Fetch real info
    this.ass.show({
      country: MapEuropeConfig[areaId].name,
      occupiedBy: {
        name: 'USA',
        color: 'rgb(40, 110, 53)'
      },
      troops: {
        soldiers: Math.floor(Math.random() * 50) + 1,
        horses: Math.floor(Math.random() * 30) + 1,
        gatlingGuns: Math.floor(Math.random() * 20) + 1,
        spies: Math.floor(Math.random() * 6) + 1
      }
    });
  }

  onNonActiveAreaClick() {
    this.previouslyClickedElement?.classList.remove('selected');
    this.previouslyClickedElement = null;
  }
}
