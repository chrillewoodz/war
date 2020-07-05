import { Component, Input } from '@angular/core';
import { MapEngine } from '../map.engine';
import { GameCache } from '../game.cache';
import { PipeResult } from '../interfaces';

@Component({
  selector: 'map-europe',
  templateUrl: './map-europe.component.html',
  styleUrls: ['./map-europe.component.scss']
})

export class MapEuropeComponent {
  @Input() result: PipeResult;
  @Input() isMyTurn: boolean;

  constructor(private cache: GameCache, private mapEngine: MapEngine) {}

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
          mouseEvent: event,
          areas,
          selected: area.state.__ui.isOwnedBySelf ? area : null,
          selectedConnection: area.state.isConnectedToSelected ? area : null,
          emitUpdateEvent: true
        });
      }
    }
  }
}