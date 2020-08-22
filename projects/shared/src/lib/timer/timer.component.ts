import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'timer',
  templateUrl: 'timer.component.html',
  styleUrls: ['timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TimerComponent implements OnInit {
  @Input() set percent (percent: number) {
    this.width = percent;
    this.isMedium = percent >= 60 && percent < 90;
    this.isHigh = percent >= 90;
  };

  public width = 0;
  public isMedium = false;
  public isHigh = false;

  constructor() {}

  ngOnInit() {}
}