import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ActionPointsApi {

  private emitter = new Subject<number>();
  public emitter$ = this.emitter.asObservable();

  constructor() {}

  showCost(cost: number) {
    this.emitter.next(cost);
  }

  hideCost() {
    this.emitter.next();
  }
}