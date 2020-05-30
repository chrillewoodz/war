import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Message {
  color: string;
  message: string;
  from: string;
}

@Injectable({
  providedIn: 'root'
})

export class GameLoggerService {

  private emitter = new Subject();
  public emitter$ = this.emitter.asObservable();

  constructor() {}

  log(message: Message) {
    this.emitter.next(message);
  }
}