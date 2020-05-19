import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'action-points',
  templateUrl: 'action-points.component.html',
  styleUrls: ['action-points.component.scss']
})

export class ActionPointsComponent implements OnInit {
  @Input() set config(config: any) {

    let points = [];

    for (let i = 0; i < config.total; i++) {
      points.push({available: false});
    }

    for (let i = 0; i < config.actionsLeft; i++) {
      points[i].available = true;
    }

    const available = points.filter(p => p.available);
    const spent = points.filter(p => !p.available);

    for (let i = available.length - 1; i > (available.length - 1 - config.actionCost); i--) {
      available[i].available = false;
      available[i].cost = true;
    }

    points = [...available, ...spent];

    this.points = points;
  };

  public points: any[];

  constructor() {}

  ngOnInit() {}
}