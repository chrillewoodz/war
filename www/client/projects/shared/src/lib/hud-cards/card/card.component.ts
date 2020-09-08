import { HUDLoggerService } from '../../hud-logger/hud-logger.service';
import { first, map, switchMap } from 'rxjs/operators';
import { ActionPointsApi } from '../../action-points/action-points.service';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { SocketApi } from '../../socket.api';
import { CardConfig } from '../../interfaces';
import { HUDCardsService } from '../hud-cards.service';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CardComponent {
  @Input() info: CardConfig;
  @Input() deckIndex: number;
  @Input() disabled: boolean;

  constructor(
    private cardsService: HUDCardsService,
    private logger: HUDLoggerService,
    private apa: ActionPointsApi,
    private socketApi: SocketApi
  ) {}

  play() {

    if (!this.disabled && this.cardsService.canPlayCard(this.info.cost)) {

      this.hideCost(); // Sometimes it gets stuck showing the cost after the card is used
      const responseObs = this.cardsService.use(this.info.id, this.deckIndex, this.logger);

      responseObs.pipe(
        first(),
        switchMap((res) => {

          return this.socketApi.update(true, res.newState).pipe(
            first(),
            map(() => res)
          );
        })
      )
      .subscribe((res) => {

        if (this.info.gameEvent) {

          if (!res.extras?.affectedAreas) {
            throw new Error('affectedAreas was not returned from card action');
          }

          this.socketApi.event(true, this.info.gameEvent, {
            affectedAreas: res.extras.affectedAreas
          });
        }
      })
    }
  }

  showCost() {

    if (!this.disabled && !this.info.isDisabled) {
      this.apa.showCost(this.info.cost);
    }
  }

  hideCost() {

    if (!this.disabled && !this.info.isDisabled) {
      this.apa.hideCost();
    }
  }
}
