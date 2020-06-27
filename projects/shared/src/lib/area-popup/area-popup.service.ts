import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AreaPopupEvent } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class AreaPopupService {

  private emitter = new Subject<AreaPopupEvent>();
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