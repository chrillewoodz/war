import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { GameCache } from 'shared';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  public stats: any;

  constructor(
    private cache: GameCache,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.stats = {
      winner: this.cache.session.state.winner
    }
  }

  backToLobby() {
    this.router.navigateByUrl('');
  }
}
