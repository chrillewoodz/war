import { AfterViewInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { timer } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

@Component({
  selector: 'screen-fight',
  templateUrl: './screen-fight.component.html',
  styleUrls: ['./screen-fight.component.scss']
})
export class ScreenFightComponent implements AfterViewInit {
  @Input() info: any;
  @Output() completed = new EventEmitter();

  public currentView;
  public isAttackStyleChosen = false;
  public isBattleActive = false;

  public initTimer$ = timer(1000, 1000).pipe(
    take(2),
    finalize(() => this.currentView = 1)
  );

  public playersAnimationTimer$ = timer(1000, 1000).pipe(
    take(6),
    finalize(() => this.currentView = 2)
  );

  public bulletConfigs = {
    attacker: {
      soldier: {
        side: 'attacker'
      },
      horse: {
        side: 'attacker'
      },
      gatlingGun: {
        side: 'attacker'
      },
    },
    defender: {
      soldier: {
        side: 'defender'
      },
      horse: {
        side: 'defender'
      },
      gatlingGun: {
        side: 'defender'
      },
    }
  }

  constructor() {}

  ngAfterViewInit() {
    this.initTimer$.subscribe();
    this.playersAnimationTimer$.subscribe();
  }

  ngOnDestroy() {

  }

  chooseTactic(tactic: 'aggressive' | 'balanced' | 'tactical') {
    console.log(tactic + ' chosen')
    this.isAttackStyleChosen = true;

    timer(1000, 1000)
      .pipe(
        take(2)
      )
      .subscribe(() => {
        this.isBattleActive = true;
      });
  }

  // TODO: Change name
  bulletsDone() {
    console.log('scf bullets done');
    this.completed.emit();
  }
}