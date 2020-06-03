import { ModalApi } from './modal.service';
import { Component, OnDestroy, Input, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnDestroy {
  @Input() id: string;
  @Input() exceptions: QueryList<HTMLElement> | HTMLElement[];

  public isOpen = false;

  private sub: Subscription;

  constructor(private modalApi: ModalApi) {

    this.sub = this.modalApi.emitter$.subscribe((e) => {

      if (e.id === this.id) {
        this.isOpen = e.state;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  close() {
    this.isOpen = false;
  }
}
