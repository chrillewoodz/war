import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class OutcomeApi {

  private emitter = new ReplaySubject<any>(1);
  public emitter$ = this.emitter.asObservable();

  constructor() {}

  show(e) {
    this.emitter.next({ ...e, shouldOpen: true });
  }

  hide() {
    this.emitter.next({
      shouldOpen: false
    });
  }
}