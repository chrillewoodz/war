import { GameEngine } from './../game.engine';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameCache } from '../game.cache';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';

@Component({
  selector: 'game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GameSettingsComponent  {

  public sessionId = this.cache.sessionId;
  public isOpen = false;

  constructor(
    private cache: GameCache,
    private gameEngine: GameEngine,
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

    const confirmed = confirm('Are you sure you want to quit the game?');

    if (confirmed) {
      this.router.navigateByUrl('');
    }
  }
}
