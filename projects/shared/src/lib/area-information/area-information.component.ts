import { AreaStatsService } from './area-stats.service';
import { Component, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AreaInformationEvent } from '../interfaces';

@Component({
  selector: 'area-information',
  templateUrl: './area-information.component.html',
  styleUrls: ['./area-information.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AreaInformationComponent implements OnDestroy {

  public stats = null;
  private sub: Subscription;

  constructor(private as: AreaStatsService, private cd: ChangeDetectorRef) {

    this.sub = this.as.emitter$.subscribe((event: AreaInformationEvent) => {
      this.stats = event.stats;
      this.cd.detectChanges();
      console.log(event);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
