import { SocketResponse, PipeResult, Session, SessionState, Faction, SessionSettings } from './interfaces';
import { GameCache } from './game.cache';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ObservableInput, merge } from 'rxjs';
import { SocketEvents } from './socket-events';
import { map, catchError, tap } from 'rxjs/operators';
import { Bound } from './decorators';

@Injectable({
  providedIn: 'root'
})

export class SocketApi {

  constructor(
    private cache: GameCache,
    private socket: Socket
  ) {}

  get(emitToServer: boolean) {
    console.log(this.cache.sessionId);

    if (emitToServer) {

      this.socket.emit(SocketEvents.GET, {
        sessionId: this.cache.sessionId
      });
    }

    return this.socketResponse$(SocketEvents.GET_SUCCESS);
  }

  join(emitToServer: boolean, faction?: Faction, sessionId?: string) {

    if (emitToServer) {

      if (!faction) {
        throw new Error('Faction must be provided');
      }

      this.socket.emit(SocketEvents.JOIN, {
        clientId: this.cache.clientId,
        sessionId: sessionId,
        faction
      });
    }

    return this.socketResponse$(SocketEvents.JOIN_SUCCESS).pipe(
      tap((result) => this.cache.setSessionId(result.session.sessionId))
    );
  }

  host(emitToServer: boolean, faction?: Faction, settings?: SessionSettings) {

    if (emitToServer) {

      if (!faction) {
        throw new Error('Faction must be provided');
      }

      this.socket.emit(SocketEvents.HOST, {
        clientId: this.cache.clientId,
        faction,
        settings
      });
    }

    return this.socketResponse$(SocketEvents.HOST_SUCCESS).pipe(
      tap((result) => this.cache.setSessionId(result.session.sessionId))
    );
  }

  quit(emitToServer: boolean) {

    if (emitToServer) {

      this.socket.emit(SocketEvents.QUIT, {
        sessionId: this.cache.sessionId,
        clientId: this.cache.clientId
      });
    }

    return this.socketResponse$(SocketEvents.QUIT_SUCCESS);
  }

  preUpdate(emitToServer: boolean, newState?: Partial<SessionState>) {

    if (emitToServer) {

      if (!newState || !Object.keys(newState).length) {
        throw new Error('newState was either empty or not provided');
      }

      this.socket.emit(SocketEvents.PRE_UPDATE, {
        sessionId: this.cache.sessionId,
        newState: {
          ...this.cache.session.state,
          newState
        }
      });
    }

    return this.socketResponse$(SocketEvents.PRE_UPDATE_SUCCESS);
  }

  update(emitToServer: boolean, newState?: Partial<SessionState>) {

    if (emitToServer) {

      if (!newState || !Object.keys(newState).length) {
        throw new Error('newState was either empty or not provided');
      }

      this.socket.emit(SocketEvents.UPDATE, {
        sessionId: this.cache.sessionId,
        newState: {
          ...this.cache.session.state,
          newState
        }
      });
    }

    return this.socketResponse$(SocketEvents.UPDATE_SUCCESS);
  }

  stats(emitToServer: boolean) {

    if (emitToServer) {
      this.socket.emit(SocketEvents.STATS);
    }

    // NOTE: Do not use socketResponse$ since this "endpoint" yields a different response
    // when compared to session-specific ones
    return this.socket.fromEvent(SocketEvents.STATS_SUCCESS);
  }

  @Bound
  private getSelf(session, clientId: string) {

    for (const player in session.state.players) {

      if (player === clientId) {
        return session.state.players[player];
      }
    }
  }

  @Bound
  private onSocketResponse(response: SocketResponse)  {
    console.log(response);

    switch (response.status) {
      case 200: return response.res;
      default: throw response.err;
    }
  }

  @Bound
  private onSocketError(err: string, caught: ObservableInput<any>) {
    console.error(err);
    return caught;
  }

  @Bound
  private getPipeResult(session: Session): PipeResult {
    console.log(this)
    return {
      session,
      self: this.getSelf(session, this.cache.clientId)
    };
  }

  private socketResponse$(event: string) {

    return merge(
      this.socket.fromEvent(event),
      this.socket.fromEvent(SocketEvents.INTERNAL_ERROR)
    )
    // VERY IMPORTANT: Remember to use @Bound when passed the callback(s)
    // directly into the pipe operator functions.
    .pipe(
      map(this.onSocketResponse),
      catchError(this.onSocketError),
      map(this.getPipeResult)
    )
  }
}