import { MapEngine } from './../map.engine';
import { AfterViewInit, Component, EventEmitter, Output, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'map-europe',
  templateUrl: './map-europe.component.html',
  styleUrls: ['./map-europe.component.scss']
})

export class MapEuropeComponent implements AfterViewInit {
  @Output() mapReady = new EventEmitter();

  constructor(private host: ElementRef, private mapEngine: MapEngine) {}

  ngAfterViewInit() {
    this.mapEngine.mapReady(this.host);
  }
}