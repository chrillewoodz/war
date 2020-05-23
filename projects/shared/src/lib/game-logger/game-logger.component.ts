import { GameLoggerService } from './game-logger.service';
import { AfterViewInit, Component, OnDestroy, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'game-logger',
  templateUrl: './game-logger.component.html',
  styleUrls: ['./game-logger.component.scss']
})

export class GameLoggerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('listRef') listRef: ElementRef;
  @ViewChildren('messageRef') messagesRef: QueryList<HTMLLIElement>;

  public message = new FormControl('', [Validators.maxLength(60)]);
  public messages = [];
  // tmp only
  public colors = ['rgb(73, 59, 50)', 'rgb(40, 110, 53)', 'gb(219, 132, 10)', 'rgb(33, 63, 156)'];

  private sub: Subscription;

  constructor(private gls: GameLoggerService) {

    // // tmp only
    interval(4000)
      .subscribe(() => {

        const i = Math.floor(Math.random() * 4) + 1;

        this.gls.log({
          color: this.colors[i],
          message: `Player ${i} attacked!`
        });
      });

    this.sub = this.gls.emitter$.subscribe((newMessage) => {
      this.messages.push(newMessage);
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

      const i = Math.floor(Math.random() * 4) + 1;

      this.gls.log({
        color: this.colors[i],
        message: this.message.value
      });

      this.message.setValue('');
    }
  }
}
