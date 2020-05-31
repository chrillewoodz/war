import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MatchMaker {

  constructor() {}

  joinBySessionId(id: string) {
    return throwError('No session with that id');
    // TODO: Call socket
  }

  quickmatch() {
    return new Observable((observer) => {
      observer.next();
    });
    // return throwError('There was a network error');
    // TODO: Call socket
  }
}