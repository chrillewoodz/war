import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'timer',
  templateUrl: 'timer.component.html',
  styleUrls: ['timer.component.scss']
})

export class TimerComponent implements OnInit {
  @Output() ranOut = new EventEmitter();
  @Input() total: number;
  @Input() set timer$ (timer$: Observable<number>) {

    timer$.subscribe((time) => {
      const percent = (time / this.total) * 100;
      this.width = percent;
      this.isMedium = percent >= 60 && percent < 90;
      this.isHigh = percent >= 90;
    });
  };

  public width = 0;
  public isMedium = false;
  public isHigh = false;

  constructor() {}

  ngOnInit() {}
}