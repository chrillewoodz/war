import { GameLoggerService } from './game-logger.service';
import { AfterViewInit, Component, OnDestroy, ViewChild, ElementRef, QueryList, ViewChildren, Input, Output, EventEmitter } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { Player, Session } from '../interfaces';

@Component({
  selector: 'game-logger',
  templateUrl: './game-logger.component.html',
  styleUrls: ['./game-logger.component.scss']
})

export class GameLoggerComponent implements AfterViewInit, OnDestroy {
  @Input() session: Session;
  @Input() player: Player;
  @Output() onNewLog = new EventEmitter();
  @ViewChild('listRef') listRef: ElementRef;
  @ViewChildren('messageRef') messagesRef: QueryList<HTMLLIElement>;

  public message = new FormControl('', [Validators.maxLength(60)]);
  // tmp only
  public colors = ['rgb(73, 59, 50)', 'rgb(40, 110, 53)', 'gb(219, 132, 10)', 'rgb(33, 63, 156)'];

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
      this.session.state.logs.push(newMessage);
      this.onNewLog.emit();
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
        color: this.player.extras.faction.colorRGB,
        message: this.message.value,
        from: this.player.extras.faction.name
      });

      this.message.setValue('');
    }
  }
}
