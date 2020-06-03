import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

interface ModalEvent {
  id: string;
  state: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ModalApi {

  private emitter = new ReplaySubject<ModalEvent>(1);
  public emitter$ = this.emitter.asObservable();

  constructor() { }

  open(id: string) {
    this.emitter.next({ id, state: true });
  }

  close(id: string) {
    this.emitter.next({ id, state: false });
  }
}