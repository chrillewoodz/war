import { SocketApi } from './../socket.api';
import { Component, Input } from '@angular/core';
import { PipeResult, Player } from '../interfaces';

@Component({
  selector: 'players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})

export class PlayersComponent {
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

  constructor(private socketApi: SocketApi) {}

  ready() {
    this.socketApi.ready(true);
  }
}
