import { Area } from './../interfaces';
import { AfterViewInit, Component, Input, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MapEngine } from '../map.engine';
import { GameCache } from '../game.cache';
import { PipeResult } from '../interfaces';

@Component({
  selector: 'map-europe',
  templateUrl: './map-europe.component.html',
  styleUrls: ['./map-europe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MapEuropeComponent implements AfterViewInit {
  @ViewChild('mapElement') map: ElementRef<SVGSVGElement>;
  @Input() result: PipeResult;
  @Input() isMyTurn: boolean;

  constructor(private cache: GameCache, private mapEngine: MapEngine) {}

  ngAfterViewInit() {
    this.cache.setMapElement(this.map.nativeElement);
  }

  mapClicked(event: MouseEvent) {

    if (!this.isMyTurn) {
      return;
    }
    const target = event.target as HTMLElement;
    const areaId = target.dataset.areaId; // NOTE: Don't parse to Number here or if check will fail for 0

    if (areaId) {

      const areas = this.cache.session.state.map.areas;
      const area = areas.find((area) => area.areaId === areaId);

      if (area.state.isActive) {

        this.mapEngine.areaClicked({
          areas,
          selected: area.state.__ui.isOwnedBySelf ? area : null,
          selectedConnection: area.state.isConnectedToSelected ? area : null
        });
      }

      // DO NOT REMOVE
      // Calculates x and y in the SVG itself, useful for finding anchor points
      // VERY IMPORTANT: See https://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y
      // why we must use clientX/Y instead of screenX/Y.
      // const areaCoords = this.mapEngine.screenToSVGCoordinates(this.map.nativeElement, event.clientX, event.clientY);
      // console.log('AREA_NAME', area?.name, 'AREA_COORDS', areaCoords);
    }
  }

  trackByArea(i: number, area: Area) {
    return area.areaId;
  }
}