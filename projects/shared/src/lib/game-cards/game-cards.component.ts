import { Card } from './../interfaces';
import { CardsService } from './cards.service';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'game-cards',
  templateUrl: './game-cards.component.html',
  styleUrls: ['./game-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GameCardsComponent {
  @Input() set cards(cards: Card[]) {

    cards = cards.map((card) => {
      card.isDisabled = this.cardsService.checkDisabledState(card.id)();
      return card;
    });

    this._cards = cards;
  };
  @Input() disabled: boolean;

  get cards() {
    return this._cards;
  }

  private _cards: any[];

  constructor(private cardsService: CardsService) {}
}
