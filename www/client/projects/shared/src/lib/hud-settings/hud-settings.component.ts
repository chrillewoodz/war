import { first } from 'rxjs/operators';
import { SocketApi } from '../socket.api';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameCache } from '../game.cache';
import { Router } from '@angular/router';

@Component({
  selector: 'hud-settings',
  templateUrl: './hud-settings.component.html',
  styleUrls: ['./hud-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HUDSettingsComponent  {

  public sessionId = this.cache.sessionId;
  public isOpen = false;

  constructor(
    private cache: GameCache,
    private router: Router,
    private socketApi: SocketApi
  ) {}

  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }

  resign() {

    const confirmed = confirm('Are you sure you want to resign?');

    if (confirmed) {
      this.socketApi.quit(true, true);
      this.close();
    }
  }

  quit() {

    const confirmed = confirm('Are you sure you want to quit the game?');

    if (confirmed) {

      this.socketApi.quit(true).pipe(
        first()
      ).subscribe(() => {
        this.router.navigateByUrl('');
      });
    }
  }
}
