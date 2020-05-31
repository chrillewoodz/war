import { Component } from '@angular/core';
import { GameCache } from '../game.cache';

@Component({
  selector: 'game-settings',
  templateUrl: './game-settings.component.html',
  styleUrls: ['./game-settings.component.scss']
})
export class GameSettingsComponent  {

  // TODO: Remove the or statement, this is just for testing in dev mode
  public sessionId = this.cache.sessionId || 'aoskdoaskd9as8da8sd7asd';
  public isOpen = false;

  constructor(private cache: GameCache) {}

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }
}
