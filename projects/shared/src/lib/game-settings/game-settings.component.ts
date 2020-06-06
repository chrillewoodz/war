import { Component } from '@angular/core';
import { GameCache } from '../game.cache';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent  {

  public sessionId = this.cache.sessionId;
  public isOpen = false;

  constructor(
    private cache: GameCache,
    private router: Router,
    private socket: Socket
  ) {}

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  resign() {
    this.socket.emit('resign', { sessionId: this.sessionId, clientId: this.cache.clientId });
  }

  quit() {
    this.socket.emit('quit', { sessionId: this.sessionId, clientId: this.cache.clientId });

    this.socket.fromEvent('quit_success')
      .pipe(
        first()
      )
      .subscribe(() => {
        this.router.navigateByUrl('');
      })
  }
}
