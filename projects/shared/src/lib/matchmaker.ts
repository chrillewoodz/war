import { SocketEvent } from './interfaces';
import { GameCache } from './game.cache';
import { map, first, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { throwError, merge } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { checkSocketEventResponse } from './helpers';

@Injectable({
  providedIn: 'root'
})

export class MatchMaker {

  constructor(private cache: GameCache, private socket: Socket) {}

  private onSocketResponse(event: string) {

    return merge<SocketEvent>(
      this.socket.fromEvent('internal_error'),
      this.socket.fromEvent(event)
    )
    .pipe(
      first(),
      switchMap(checkSocketEventResponse),
      tap((e) => {
        this.cache.setSessionId(e.res.sessionId);
      })
    );
  }

  join(id?: string) {

    this.socket.emit('join', {
      sessionId: id || this.cache.sessionId, // Re-join existing game if you left it
      clientId: this.cache.clientId
    });

    return this.onSocketResponse('join_success');
  }

  host(settings) {

    this.socket.emit('host', {
      cachedSessionId: this.cache.sessionId, // Re-join existing game if you left it
      clientId: this.cache.clientId,
      settings
    });

    return this.onSocketResponse('host_success');
  }
}