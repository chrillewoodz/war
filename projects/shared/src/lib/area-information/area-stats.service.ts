import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AreaInformationEvent, AreaStatsInformation } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class AreaStatsService {

  private emitter = new ReplaySubject<AreaInformationEvent>(1);
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