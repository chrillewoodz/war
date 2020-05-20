import { AfterViewInit, Component, Input } from '@angular/core';
import { timer } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

@Component({
  selector: 'screen-fight',
  templateUrl: './screen-fight.component.html',
  styleUrls: ['./screen-fight.component.scss']
})
export class ScreenFightComponent implements AfterViewInit {
  @Input() info: any;

  public currentView;

  public initTimer$ = timer(1000, 1000).pipe(
    take(2),
    finalize(() => this.currentView = 1)
  );

  public playersAnimationTimer$ = timer(1000, 1000).pipe(
    take(6),
    finalize(() => this.currentView = 2)
  );

  constructor() {}

  ngAfterViewInit() {
    this.initTimer$.subscribe();
    this.playersAnimationTimer$.subscribe();
  }

  ngOnDestroy() {

  }

  chooseTactic(tactic: 'aggressive' | 'balanced' | 'tactical') {
    console.log(tactic + ' chosen')
  }
}