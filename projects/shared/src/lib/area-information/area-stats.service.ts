import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AreaStatsService {

  private emitter = new Subject();
  public emitter$ = this.emitter.asObservable();

  constructor() {}

  show(stats: any) {
    this.emitter.next({
      shouldOpen: true,
      stats: {
        ...stats
      }
    });
  }

  hide() {
    this.emitter.next({
      shouldOpen: false,
      stats: null
    });
  }
}