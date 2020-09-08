import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'number-bubble',
  templateUrl: './number-bubble.component.html',
  styleUrls: ['./number-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NumberBubbleComponent implements OnInit {
  @Input() number: number;
  @Input() position: 'bottom-left' | 'bottom-right' = 'bottom-left';
  @Input() type: 'power' | 'amount' = 'power';

  constructor() { }

  ngOnInit(): void {
  }

}
