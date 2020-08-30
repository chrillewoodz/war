import { map, tap, startWith } from 'rxjs/operators';
import { ActionPointsApi } from './action-points.service';
import { Component, OnDestroy, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'action-points',
  templateUrl: 'action-points.component.html',
  styleUrls: ['action-points.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ActionPointsComponent implements OnDestroy {
  @Input() total: number = 20;
  @Input() set APLeft(APLeft: number) {
    this._APLeft = APLeft;
    this.api.hideCost();
    // this.height = this.getHeight();
  };

  get APLeft() {
    return this._APLeft;
  }

  public APLeftVisual: number;
  public height: number;
  public cost: number;

  private _APLeft: number;
  private sub: Subscription;

  constructor(private api: ActionPointsApi, private cd: ChangeDetectorRef) {

    this.sub = this.api.emitter$
      .pipe(
        startWith(0),
        map((cost) => cost === undefined ? 0 : cost)
      )
      .subscribe((cost) => {
        this.cost = cost;
        this.height = this.getHeight();
        this.cd.markForCheck();
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private getHeight() {
    return ((this.APLeft - this.cost) / this.total) * 100;
  }
}