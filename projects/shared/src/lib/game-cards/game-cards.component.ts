import { Component, Input } from '@angular/core';

@Component({
  selector: 'game-cards',
  templateUrl: './game-cards.component.html',
  styleUrls: ['./game-cards.component.scss']
})
export class GameCardsComponent {
  @Input() cards: any[];

  constructor() {}
}
