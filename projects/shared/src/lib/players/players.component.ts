import { Component, Input } from '@angular/core';
import { Players, Player } from './players.types';

@Component({
  selector: 'players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})

export class PlayersComponent {
  @Input() set players(players: Players) {
    this.player1 = players['1'];
    this.player2 = players['2'];
    this.player3 = players['3'];
    this.player4 = players['4'];
  };

  public player1: Player;
  public player2: Player;
  public player3: Player;
  public player4: Player;

  constructor() {}
}
