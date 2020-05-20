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
          stagger(300, [
            animate('0.5s', style({ opacity: 1, visibility: 'visible', transform: 'translate3d(700px, 0, 0)', background: 'darkred'})),
            animate('0.5s', style({ opacity: 0, visibility: 'hidden' }))
          ])
        ]),
      ]),
      transition('* => defender', [
        query(':enter', [
          style({ opacity: 0 }),
          stagger(300, [
            animate('0.5s', style({ opacity: 1, visibility: 'visible', transform: 'translate3d(-700px, 0, 0)', background: 'darkred'})),
            animate('0.5s', style({ opacity: 0, visibility: 'hidden' }))
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

  public bullets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  constructor() {}

  animationDone() {
    console.log('bullets done');
    this.completed.emit();
  }
}
