import { Component, Input } from '@angular/core';

import { SocketApi } from './../../socket.api';
import { Card } from './../../interfaces';
import { CardsService } from '../cards.service';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent {
  @Input() config: Card;
  @Input() deckIndex: number;
  @Input() disabled: boolean;

  constructor(
    private cardsService: CardsService,
    private socketApi: SocketApi
  ) {}

  use() {
    const newState = this.cardsService.use(this.config.id);
    this.socketApi.update(true, newState);
  }
}
