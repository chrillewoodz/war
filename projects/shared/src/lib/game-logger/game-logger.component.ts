import { PipeResult } from './../interfaces';
import { GameLoggerService } from './game-logger.service';
import { AfterViewInit, Component, OnDestroy, ViewChild, ElementRef, QueryList, ViewChildren, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'game-logger',
  templateUrl: './game-logger.component.html',
  styleUrls: ['./game-logger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GameLoggerComponent implements AfterViewInit, OnDestroy {
  @Input() result: PipeResult;
  @Output() onNewLog = new EventEmitter();
  @ViewChild('listRef') listRef: ElementRef;
  @ViewChildren('messageRef') messagesRef: QueryList<HTMLLIElement>;

  public message = new FormControl('', [Validators.maxLength(60)]);

  private sub: Subscription;

  constructor(private gls: GameLoggerService) {

    // // tmp only
    // interval(4000)
    //   .subscribe(() => {

    //     const i = Math.floor(Math.random() * 4) + 1;

    //     this.gls.log({
    //       color: '#000',
    //       message: `Player ${i} attacked!`,
    //       from: '[game]'
    //     });
    //   });

    this.sub = this.gls.emitter$.subscribe((newMessage) => {

      const updatedLogs = [...this.result.session.state.logs, newMessage];
      const newState = { ...this.result.session.state, logs: updatedLogs };

      this.onNewLog.emit(newState);
    });
  }

  ngAfterViewInit() {
    this.messagesRef.changes.subscribe(() => {
      const list = this.listRef.nativeElement;
      list.scrollTop = list.scrollHeight;
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  submit(e: KeyboardEvent) {

    e.preventDefault();

    if (this.message.valid) {

      this.gls.log({
        color: this.result.self.extras.faction.colorRGB,
        message: this.message.value,
        from: this.result.self.extras.faction.name
      });

      this.message.setValue('');
    }
  }
}
