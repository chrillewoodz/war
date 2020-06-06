import { GameEngine, GameEngineEvent } from './../game.engine';
import { Component, Input } from '@angular/core';
import { Player } from '../interfaces';

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

  public ready$ = this.gameEngine.listen(GameEngineEvent.Ready);
  public start$ = this.gameEngine.listen(GameEngineEvent.Start);
  public _players: Player[] = [];

  get players() {
    return this._players;
  }

  constructor(private gameEngine: GameEngine) {}

  startGame() {
    this.gameEngine.startGame();
  }
}
