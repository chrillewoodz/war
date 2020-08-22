import { PipeResult } from '../interfaces';
import { HUDLoggerService } from './hud-logger.service';
import { AfterViewInit, Component, ViewChild, ElementRef, QueryList, ViewChildren, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'hud-logger',
  templateUrl: './hud-logger.component.html',
  styleUrls: ['./hud-logger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HUDLoggerComponent implements AfterViewInit {
  @Input() set result(result: PipeResult) {

    if (result) {

      result.session.state.logs = result.session.state.logs.map((log) => {
        log.message = this.sanitizer.bypassSecurityTrustHtml(log.message) as string;
        return log;
      });

      this._result = result;
    }
  };
  @ViewChild('listRef') listRef: ElementRef;
  @ViewChildren('messageRef') messagesRef: QueryList<HTMLLIElement>;

  get result() {
    return this._result;
  }

  private _result: PipeResult;

  public message = new FormControl('', [Validators.maxLength(60)]);

  constructor(
    private logger: HUDLoggerService,
    private sanitizer: DomSanitizer
  ) {}

  ngAfterViewInit() {
    this.messagesRef.changes.subscribe(() => {
      const list = this.listRef.nativeElement;
      list.scrollTop = list.scrollHeight;
    })
  }

  submit(e: KeyboardEvent) {

    e.preventDefault();

    if (this.message.valid) {

      this.logger.log({
        color: this.result.self.extras.faction.colorRGB,
        message: this.message.value,
        from: this.result.self.extras.faction.name
      });

      this.message.setValue('');
    }
  }
}
