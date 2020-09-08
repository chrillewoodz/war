import { CardConfig } from '../interfaces';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { HUDCardsService } from './hud-cards.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'hud-cards',
  templateUrl: './hud-cards.component.html',
  styleUrls: ['./hud-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('card', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('500ms', style({ transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ 'pointer-events': 'none' }),
        animate('350ms', style({
          transform: 'translate3d(-250%, -150%, 0) rotate(-15deg) scale(1.2)'
        })),
        animate('500ms', style({
          opacity: 0
        }))
      ])
    ])
  ]
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

  cardTrackBy(i: number, card: CardConfig) {
    return card.id;
  }
}
