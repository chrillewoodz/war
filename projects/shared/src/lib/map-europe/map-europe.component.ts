import { Component, Input } from '@angular/core';
import { MapEngine } from './../map.engine';
import { Area } from './../interfaces';

@Component({
  selector: 'map-europe',
  templateUrl: './map-europe.component.html',
  styleUrls: ['./map-europe.component.scss']
})

export class MapEuropeComponent {
  @Input() areas: Area[] = [];

  constructor(private mapEngine: MapEngine) {}

  areaClicked(event: MouseEvent, area: Area) {

    if (area.state.isActive) {
      this.mapEngine.setSelected({ areas: this.areas, area, mouseEvent: event });
    }
  }
}