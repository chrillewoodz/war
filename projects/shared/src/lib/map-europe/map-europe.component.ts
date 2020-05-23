import { AfterViewInit, Component, OnInit, Renderer2, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'map-europe',
  templateUrl: './map-europe.component.html',
  styleUrls: ['./map-europe.component.scss']
})

export class MapEuropeComponent implements AfterViewInit, OnInit {
  @Output() mapReady = new EventEmitter();

  constructor(private renderer: Renderer2, private host: ElementRef){}

  ngOnInit() {}

  ngAfterViewInit() {

    const areas = Array.from(this.host.nativeElement.querySelectorAll('.cls-1'));

    areas.forEach((el, i) => {
      this.renderer.setAttribute(el, 'data-area-id', String(i));
    });

    this.mapReady.emit({
      areas
    });
  }
}