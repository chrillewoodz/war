import { ActionPointsApi } from './action-points.service';
import { Component, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'action-points',
  templateUrl: 'action-points.component.html',
  styleUrls: ['action-points.component.scss']
})

export class ActionPointsComponent implements OnDestroy {
  @Input() set config(config: any) {
    this._config = config;
    this.points = this.generatePoints(config.total, config.actionsLeft);
  };

  get config() {
    return this._config;
  }

  public points: any[];

  private _config;
  private sub: Subscription;

  constructor(private api: ActionPointsApi) {

    this.sub = this.api.emitter$.subscribe((cost) => {
      this.points = this.generatePoints(this.config.total, this.config.actionsLeft, cost);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  generatePoints(total: number, actionsLeft: number, actionCost?: number) {

    let points = [];

    for (let i = 0; i < total; i++) {
      points.push({available: false});
    }

    for (let i = 0; i < actionsLeft; i++) {
      points[i].available = true;
    }

    const available = points.filter(p => p.available);
    const spent = points.filter(p => !p.available);

    for (let i = available.length - 1; i > (available.length - 1 - actionCost); i--) {
      available[i].available = false;
      available[i].cost = true;
    }

    points = [...available, ...spent];

    return points;
  }
}