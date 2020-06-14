import { SocketResponse, PipeResult, Session, SessionState, SessionSettings, Extras } from './interfaces';
import { GameCache } from './game.cache';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ObservableInput, merge, throwError } from 'rxjs';
import { SocketEvents } from './socket-events';
import { map, catchError, tap } from 'rxjs/operators';
import { Bound } from './decorators';

@Injectable({
  providedIn: 'root'
})

export class SocketApi {

  private socketEvents = new SocketEvents();

  constructor(
    private cache: GameCache,
    private socket: Socket
  ) {}

  get(emitToServer: boolean) {

    if (emitToServer) {

      this.socket.emit(this.socketEvents.GET, {
        sessionId: this.cache.sessionId
      });
    }

    return this.socketResponse$(this.socketEvents.GET_SUCCESS);
  }

  join(emitToServer: boolean, extras?: Extras, sessionId?: string) {

    if (emitToServer) {

      this.socket.emit(this.socketEvents.JOIN, {
        clientId: this.cache.clientId,
        sessionId,
        extras
      });
    }

    return this.socketResponse$(this.socketEvents.UPDATE_SUCCESS);
  }

  host(emitToServer: boolean, extras?: Extras, settings?: SessionSettings) {

    if (emitToServer) {

      this.socket.emit(this.socketEvents.HOST, {
        clientId: this.cache.clientId,
        extras,
        settings
      });
    }

    return this.socketResponse$(this.socketEvents.UPDATE_SUCCESS);
  }

  quit(emitToServer: boolean) {

    if (emitToServer) {

      this.socket.emit(this.socketEvents.QUIT, {
        sessionId: this.cache.sessionId,
        clientId: this.cache.clientId
      });
    }

    return this.socketResponse$(this.socketEvents.UPDATE_SUCCESS);
  }

  ready(emitToServer: boolean) {

    if (emitToServer) {

      this.socket.emit(this.socketEvents.READY, {
        sessionId: this.cache.sessionId,
        clientId: this.cache.clientId
      });
    }

    return this.socketResponse$(this.socketEvents.UPDATE_SUCCESS);
  }

  start(emitToServer: boolean) {

    if (emitToServer) {

      this.socket.emit(this.socketEvents.START, {
        sessionId: this.cache.sessionId,
        clientId: this.cache.clientId
      });
    }

    return this.socketResponse$(this.socketEvents.UPDATE_SUCCESS);
  }

  update(emitToServer: boolean, newState?: Partial<SessionState>) {

    if (emitToServer) {

      if (!newState || !Object.keys(newState).length) {
        throw new Error('newState was either empty or not provided');
      }

      this.socket.emit(this.socketEvents.UPDATE, {
        sessionId: this.cache.sessionId,
        newState: {
          ...this.cache.session.state,
          ...newState
        }
      });
    }

    return this.socketResponse$(this.socketEvents.UPDATE_SUCCESS);
  }

  stats(emitToServer: boolean) {

    if (emitToServer) {
      this.socket.emit(this.socketEvents.STATS);
    }

    // NOTE: Do not use socketResponse$ since this "endpoint" yields a different response
    // when compared to session-specific ones
    return this.socket.fromEvent(this.socketEvents.STATS_SUCCESS).pipe(
      map(this.onSocketResponse),
      catchError(this.onSocketError)
    );
  }

  isActive() {

    this.socket.emit(this.socketEvents.IS_ACTIVE, {
      sessionId: this.cache.sessionId,
      clientId: this.cache.clientId
    });
  }

  end(emitToServer: boolean) {

    if (emitToServer) {

      this.socket.emit(this.socketEvents.END, {
        sessionId: this.cache.sessionId,
        clientId: this.cache.clientId
      });
    }

    return this.socketResponse$(this.socketEvents.UPDATE_SUCCESS);
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
      case 200: return response.data;
      default: throw response.err;
    }
  }

  @Bound
  private onSocketError(err: string, caught: ObservableInput<any>) {
    console.error(err);
    return throwError(err);
  }

  @Bound
  private getPipeResult(session: Session): PipeResult {

    return {
      session,
      self: this.getSelf(session, this.cache.clientId)
    };
  }

  private socketResponse$(event: string) {

    return merge(
      this.socket.fromEvent(event),
      this.socket.fromEvent(this.socketEvents.INTERNAL_ERROR)
    )
    // VERY IMPORTANT: Remember to use @Bound when passed the callback(s)
    // directly into the pipe operator functions.
    .pipe(
      map(this.onSocketResponse),
      catchError(this.onSocketError),
      map(this.getPipeResult),
      tap((result) => {
        this.cache.setSessionId(result.session.sessionId);
        this.cache.setSession(result.session);
      })
    );
  }
}