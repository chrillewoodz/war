import { CardConfig } from './../interfaces';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Card } from '../interfaces';
import { HUDCardsService } from './hud-cards.service';

@Component({
  selector: 'hud-cards',
  templateUrl: './hud-cards.component.html',
  styleUrls: ['./hud-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HUDCardsComponent {
  @Input() set cards(cards: CardConfig[]) {

    cards = cards.map((card) => {
      card.isDisabled = this.cardsService.checkDisabledState(card.id);
      return card;
    });

    this._cards = cards;
  };
  @Input() disabled: boolean;

  get cards() {
    return this._cards;
  }

  private _cards: any[];

  constructor(private cardsService: HUDCardsService) {}
}
