import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface BulletsConfig {
  side: 'attacker' | 'defender';
}

@Component({
  selector: 'bullets',
  templateUrl: './bullets.component.html',
  styleUrls: ['./bullets.component.scss'],
  animations: [
    trigger('animation', [
      transition('* => attacker', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger(200, [
            animate('0.1s', style({ opacity: 1, visibility: 'visible', transform: 'translate3d(200px, 0, 0)', background: 'darkred'})),
            animate('0.3s', style({ transform: 'translate3d(750px, 0, 0)', background: 'darkred'})),
            animate('0.3s', style({ opacity: 0, visibility: 'hidden' }))
          ])
        ]),
      ]),
      transition('* => defender', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger(200, [
            animate('0.1s', style({ opacity: 1, visibility: 'visible', transform: 'translate3d(-200px, 0, 0)', background: 'darkred'})),
            animate('0.3s', style({ transform: 'translate3d(-750px, 0, 0)', background: 'darkred'})),
            animate('0.3s', style({ opacity: 0, visibility: 'hidden' }))
          ])
        ]),
      ])
    ])
  ]
})

export class BulletsComponent {
  @Output() completed = new EventEmitter();
  @Input() set config(config: BulletsConfig) {
    this._config = config;
  }

  get config() {
    return this._config;
  }

  private _config;

  public bullets = [];

  constructor() {

    for (let i = 0; i < 25; i++) {
      this.bullets.push(i);
    }
  }

  animationDone() {
    console.log('bullets done');
    this.completed.emit();
  }
}
