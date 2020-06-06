import { AreaStatsService } from './area-stats.service';
import { Component, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'area-information',
  templateUrl: './area-information.component.html',
  styleUrls: ['./area-information.component.scss']
})
export class AreaInformationComponent implements OnDestroy {
  @Input() set areas (areas: any[]) {
    this._areas = areas;
    this.cd.detectChanges();
  };
  @Input() activeAreas: any[];

  public isOpen = false;
  public information = null;

  get areas() {
    return this._areas;
  }

  private _areas;
  private sub: Subscription;

  constructor(private as: AreaStatsService, private cd: ChangeDetectorRef) {

    this.sub = this.as.emitter$.subscribe((event: any) => {
      this.isOpen = event.shouldOpen;
      this.information = event.stats;
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
