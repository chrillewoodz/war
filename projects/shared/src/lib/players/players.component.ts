import { Component, Input } from '@angular/core';
import { Player } from './players.types';

@Component({
  selector: 'players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})

export class PlayersComponent {
  @Input() self;
  @Input() set players(players: Player[]) {

    if (players) {
      this._players = Object.keys(players).map((player) => players[player]);
      console.log(this._players);
    }
  };

  public _players: Player[] = [];

  get players() {
    return this._players;
  }

  constructor() {}
}
