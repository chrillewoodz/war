import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AreaInformationEvent, AreaStatsInformation } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class AreaStatsService {

  private emitter = new Subject<AreaInformationEvent>();
  public emitter$ = this.emitter.asObservable();

  constructor() {}

  show(stats: AreaStatsInformation) {
    this.emitter.next({
      stats
    });
  }

  hide() {
    this.emitter.next({
      stats: null
    });
  }
}