import { LogMessage } from '../interfaces';
import { SocketApi } from '../socket.api';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HUDLoggerService {

  private emitter = new Subject();
  public emitter$ = this.emitter.asObservable();

  constructor(private socketApi: SocketApi) {}

  log(message: LogMessage) {

    message.color = message.color || '#000';
    message.from = message.from || '[game]';

    return this.socketApi.logMessage(true, message);
  }
}