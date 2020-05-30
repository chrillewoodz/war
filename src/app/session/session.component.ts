import { Component, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { interval, timer, Subscription } from 'rxjs';
import { takeUntil, map, startWith, take } from 'rxjs/operators';

import {
  Players,
  MapEngine,
  MapEuropeComponent,
  MapEuropeConnections
} from 'shared';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})

export class SessionComponent implements OnDestroy {
  @ViewChild('mapInstance') map: MapEuropeComponent;

  public isFightActive = false;

  public config = {
    total: 25,
    actionsLeft: 12,
    actionCost: 3
  }

  public stats = {
    totalTerritories: 32,
    ownedTerritories: 3,
    ownedArmies: {
      soldiers: 12,
      horses: 7,
      gatlinGuns: 2,
      spies: 3,
      idleArmies: 8
    }
  }

  // Allow 2-4 players
  public players: Players = {
    '1': { name: 'Gustav Vasa', colorRGB: 'rgb(242, 248, 81)', colorRGBA: 'rgba(242, 248, 81, 0.6)', faction: 'sweden' },
    '2': { name: 'Fu Ling', colorRGB: 'rgb(40, 110, 53)', colorRGBA: 'rgba(40, 110, 53, 0.6)', faction: 'china' },
    '3': { name: 'John Long Schlong', colorRGB: 'rgb(219, 132, 10)', colorRGBA: 'rgba(219, 132, 10, 0.6)', faction: 'pirates' },
    '4': { name: 'Adolf Hamburger', colorRGB: 'rgb(226, 47, 142)', colorRGBA: 'rgba(226, 47, 142, 0.6)', faction: 'hamburg' }
  };

  public playerState = {
    areas: [36, 13],
    colorRGB: this.players['1'].colorRGB
  };

  public cards = [
    { img: 'soldier', title: 'An unexpected ally', action: () => {
      console.log('reinforcements coming!');
    }},
    { img: 'horse', title: 'Call in the cavalry', action: () => {
      console.log('Cavalry incoming!');
    }},
    { img: 'spy', title: 'Espionage', action: () => {
      console.log('Spies deployed!');
    }},
    { img: 'gatling-gun', title: 'Unleash hell', action: () => {
      console.log('Unleasing hell...');
    }},
    { img: 'soldier', title: 'Convert workers', action: () => {
      console.log('Workers converted to soliders!');
    }}
  ];

  public currentFight = {
    attacker: {
      name: 'Josef Stalin',
      troops: {
        soldiers: 5,
        horses: 2,
        gatlinGuns: 1
      }
    },
    defender: {
      name: 'Benjamin Franklin',
      troops: {
        soldiers: 3,
        horses: 1,
        gatlinGuns: 0
      }
    }
  }

  public mapType = 'europe';
  public activeAreas: HTMLElement[];
  public areas: HTMLElement[];
  public timePerRound = 90000;
  public totalTerritories = 32;

  public timer$ = timer(1000, 1000)
    .pipe(
      map((t) => (1 + t) * 1000),
      take(this.timePerRound / 1000)
    );

  private subscriptions = new Subscription();

  constructor(private cd: ChangeDetectorRef, private mapEngine: MapEngine) {

    const areasSub = this.mapEngine.areas$.subscribe((areas) => {
      this.areas = areas;
    });

    const activeAreasSub = this.mapEngine.activeAreas$.subscribe((activeAreas) => {
      this.activeAreas = activeAreas;
    });

    this.subscriptions.add(areasSub);
    this.subscriptions.add(activeAreasSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {

    // TODO: Move to "dynamic" place
    this.mapEngine.renderActiveAreas(MapEuropeConnections, this.playerState?.areas);
    this.mapEngine.renderPlayerAreas(this.playerState?.areas, this.playerState?.colorRGB);
  }

  endTurn() {
    console.log('turn ended');
  }

  initFight() {
    this.isFightActive = true;
  }

  fightCompleted(e) {
    this.isFightActive = false;
    console.log('fight completed');
  }

  onMapReady(e) {
    this.areas = e.areas;
    this.cd.detectChanges();
  }
}
