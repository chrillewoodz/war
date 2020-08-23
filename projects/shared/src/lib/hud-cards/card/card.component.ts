import { ActionPointsApi } from './../../action-points/action-points.service';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { SocketApi } from './../../socket.api';
import { Card } from './../../interfaces';
import { HUDCardsService } from '../hud-cards.service';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CardComponent {
  @Input() config: Card;
  @Input() deckIndex: number;
  @Input() disabled: boolean;

  constructor(
    private cardsService: HUDCardsService,
    private apa: ActionPointsApi,
    private socketApi: SocketApi
  ) {}

  play() {

    if (!this.disabled && this.cardsService.canPlayCard(this.config.cost)) {
      this.hideCost(); // Sometimes it gets stuck showing the cost after the card is used
      const newState = this.cardsService.use(this.config.id);
      this.socketApi.update(true, newState);
    }
  }

  showCost() {

    if (!this.disabled && !this.config.isDisabled) {
      this.apa.showCost(this.config.cost);
    }
  }

  hideCost() {

    if (!this.disabled && !this.config.isDisabled) {
      this.apa.hideCost();
    }
  }
}
