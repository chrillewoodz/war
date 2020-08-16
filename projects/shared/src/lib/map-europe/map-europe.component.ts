import { GameConfig } from './../game.config';
import { Army } from './../interfaces';
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
  @Input() set result(result: PipeResult) {

    // if (result) {

    //   result.session.state.areas = result.session.state.areas.map((area) => {

    //     area.state.__ui.screenXY = this.mapEngine.mapToScreenCoordinates(this.map.nativeElement, area.anchorPoints.main.x, area.anchorPoints.main.y);

    //     const totalPower = Object.keys(area.state.armies)
    //       .filter((k) => k !== 'spies') // Do not take spies into consideration
    //       .map((k) => ({key: k, army: area.state.armies[k]}))
    //       .reduce((total, current) => {
    //         return total += current.army.amount * (GameConfig.armyTypes[current.key] as Army).power;
    //       }, 0);

    //     area.state.__ui.power = totalPower;
    //     area.state.__ui.showPowerOn = area.state.__ui.isOwnedBySelf || !!area.state.spiedOnBy[this.cache.clientId];
    //     // console.log(area.state.__ui.showPowerOn, area.state.__ui.isOwnedBySelf, area.state.spiedOnBy, area.name);
    //     return area;
    //   });
    // }

    this._result = result;
  };
  @Input() isMyTurn: boolean;

  get result() {
    return this._result;
  }

  private _result: PipeResult;

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

      const areas = this.cache.session.state.areas;
      const area = areas.find((area) => area.areaId === areaId);

      if (area.state.isActive) {

        this.mapEngine.areaClicked({
          // mouseEvent: event,
          areas,
          selected: area.state.__ui.isOwnedBySelf ? area : null,
          selectedConnection: area.state.isConnectedToSelected ? area : null,
          // emitUpdateEvent: true
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
}