import { Component, ChangeDetectionStrategy, ComponentRef } from '@angular/core';
import { timer } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { GameCache } from './../game.cache';
import { OutcomeConfig } from './../interfaces';
import { MapEngine } from './../map.engine';

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

    // Show the outcome at the predefined anchor point for the area
    const selectedConnection = this.cache.getSelectedConnectedArea();
    const anchorPoint = this.mapEngine.mapToScreenCoordinates(this.cache.mapElement, selectedConnection.anchorPoints.main.x, selectedConnection.anchorPoints.main.y);

    this.x = this.config.x || anchorPoint.x;
    this.y = this.config.y || anchorPoint.y;

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
