import { AreaStatsService } from './area-stats.service';
import { Component, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'area-information',
  templateUrl: './area-information.component.html',
  styleUrls: ['./area-information.component.scss']
})
export class AreaInformationComponent implements OnDestroy {
  @Input() areas: any[];

  public isOpen = false;
  public information = null;

  private sub: Subscription;

  constructor(private as: AreaStatsService) {

    this.sub = this.as.emitter$.subscribe((event: any) => {
      this.isOpen = event.shouldOpen;
      this.information = event.stats;
      console.log(this.information)
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  close() {
    this.isOpen = false;
    this.information = null;
  }
}
