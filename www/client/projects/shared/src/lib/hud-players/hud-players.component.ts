import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { SocketApi } from '../socket.api';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PipeResult, Player } from '../interfaces';

@Component({
  selector: 'hud-players',
  templateUrl: './hud-players.component.html',
  styleUrls: ['./hud-players.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HUDPlayersComponent {
  @Input() set result(result: PipeResult) {

    if (result) {

      const players = result.session.state.players;

      if (players) {
        this.players = Object.keys(players).map((player) => players[player]);
      }

      this._result = result;
    }
  };

  get result() {
    return this._result;
  }

  public players: Player[] = [];

  private _result: PipeResult;

  constructor(
    private router: Router,
    private socketApi: SocketApi
  ) {}

  ready() {
    this.socketApi.ready(true);
  }

  leave() {
    this.socketApi.quit(true).pipe(
      first()
    ).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}
