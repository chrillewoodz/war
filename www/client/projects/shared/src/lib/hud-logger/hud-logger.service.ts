import { LogMessage } from '../interfaces';
import { SocketApi } from '../socket.api';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})

export class HUDLoggerService {

  private emitter = new Subject();
  public emitter$ = this.emitter.asObservable();

  constructor(private socketApi: SocketApi) {}

  log(message: LogMessage) {

    message.id = v4();
    message.color = message.color || '#000';
    message.from = message.from || '[game]';
    message.timestamp = message.timestamp || new Date().toISOString();

    return this.socketApi.logMessage(true, message);
  }

  getColoredString(color: string, content: string) {
    return `<span style="color: ${color};">${content}</span>`
  }
}