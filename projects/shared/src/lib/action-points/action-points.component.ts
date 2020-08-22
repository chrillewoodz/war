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
  @Input() set actionPointsLeft(actionPointsLeft: number) {
    this._actionPointsLeft = actionPointsLeft;
    this.height = this.getHeight();
  };

  get actionPointsLeft() {
    return this._actionPointsLeft;
  }

  public height: number;
  public cost: number;

  private _actionPointsLeft: number;
  private sub: Subscription;

  constructor(private api: ActionPointsApi, private cd: ChangeDetectorRef) {

    this.sub = this.api.emitter$.subscribe((cost) => {
      this.cost = cost;
      this.height = this.getHeight(cost);
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private getHeight(cost = 0) {
    return ((this.actionPointsLeft - cost) / this.total) * 100;
  }
}