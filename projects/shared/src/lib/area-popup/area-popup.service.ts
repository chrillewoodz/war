import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { AreaPopupEvent } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class AreaPopupService {

  private emitter = new ReplaySubject<AreaPopupEvent>(1);
  public emitter$ = this.emitter.asObservable();

  constructor() {}

  show(e: Omit<AreaPopupEvent, 'shouldOpen'>) {
    this.emitter.next({ ...e, shouldOpen: true });
  }

  hide() {
    this.emitter.next({
      shouldOpen: false
    });
  }
}