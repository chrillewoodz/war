// import { MapEngine } from './map.engine';
// import { Directive, HostListener, Renderer2 } from '@angular/core';
// import { MapEuropeConfig } from './map-europe/map-europe.config';
// import { AreaStatsService } from './area-information/area-stats.service';

// @Directive({
//   selector: '[areaHandler]'
// })

// export class AreaHandlerDirective {

//   @HostListener('document:click', ['$event'])
//   onDocumentClick(e: MouseEvent) {

//     const target: HTMLElement = e.target as HTMLElement;
//     const areaId = target.dataset.areaId;

//     // NOTE: Don't convert areaId to Number before these checks
//     // or 0 will be counted as false
//     if (areaId && target.classList.contains('active') && target.classList.contains('owned')) {
//       this.mapEngine.setSelected(Number(areaId));
//     }
//     else if (areaId && target.classList.contains('active')) {
//       this.mapEngine.setConnection(Number(areaId));
//     }
//     else {
//       this.mapEngine.clearSelected();
//       this.mapEngine.clearConnection();
//     }
//   }

//   constructor(private mapEngine: MapEngine) {}
// }
