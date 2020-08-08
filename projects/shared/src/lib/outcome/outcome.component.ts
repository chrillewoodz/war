import { Component, ChangeDetectionStrategy, ComponentRef } from '@angular/core';
import { timer } from 'rxjs';
import { tap, first } from 'rxjs/operators';
import { GameCache } from './../game.cache';
import { MapEngine } from './../map.engine';

@Component({
  selector: 'outcome',
  templateUrl: './outcome.component.html',
  styleUrls: ['./outcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OutcomeComponent {

  public x: number;
  public y: number;
  public componentRef: ComponentRef<this>;

  constructor(
    private cache: GameCache,
    private mapEngine: MapEngine
  ) {

    // Show the outcome at the predefined anchor point for the area
    const selectedConnection = this.cache.getSelectedConnectedArea();
    const anchorPoint = this.mapEngine.mapToScreenCoordinates(this.cache.mapElement, selectedConnection.anchorPoints.main.x, selectedConnection.anchorPoints.main.y);

    this.x = anchorPoint.x;
    this.y = anchorPoint.y;

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
