import { Component, ChangeDetectionStrategy, ComponentRef } from '@angular/core';
import { timer } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { GameCache } from '../game.cache';
import { OutcomeConfig } from '../interfaces';
import { MapEngine } from '../map.engine';

@Component({
  selector: 'outcome',
  templateUrl: './outcome.component.html',
  styleUrls: ['./outcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OutcomeComponent {

  public componentRef: ComponentRef<this>;
  public config: OutcomeConfig;
  public x: number;
  public y: number;

  constructor(
    private cache: GameCache,
    private mapEngine: MapEngine
  ) {}

  init() {

    if (this.config.x && !this.config.y) {
      throw new Error('x was defined but not y');
    }
    else if (this.config.y && !this.config.x) {
      throw new Error('y was defined but not x');
    }

    if (this.config.x && this.config.y) {
      this.x = this.config.x;
      this.y = this.config.y;
    }
    else {

      // Show the outcome at the predefined anchor point for the area
      const anchorPoint = this.mapEngine.mapToScreenCoordinates(this.cache.mapElement, this.config.area.anchorPoints.main.x, this.config.area.anchorPoints.main.y);

      this.x = anchorPoint.x;
      this.y = anchorPoint.y;
    }

    timer(2800)
      .pipe(
        first(),
        tap(() => {
          this.componentRef.destroy();
        })
      )
      .subscribe();
  }
}
