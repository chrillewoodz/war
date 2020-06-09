import { Component, Input } from '@angular/core';
import { Player, Session } from '../interfaces';
import { GameEngine } from '../game.engine';

@Component({
  selector: 'players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})

export class PlayersComponent {
  @Input() session: Session;
  @Input() self: Player;
  @Input() set players(players: Player[]) {

    if (players) {
      this._players = Object.keys(players).map((player) => players[player]);
    }
  };

  public _players: Player[] = [];

  get players() {
    return this._players;
  }

  constructor(private gameEngine: GameEngine) {}

  ready() {
    this.gameEngine.setReadyState();
  }
}
