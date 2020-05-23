import { Component, ChangeDetectorRef } from '@angular/core';
import { interval, timer } from 'rxjs';
import { takeUntil, map, startWith, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

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
      spies: 3
    }
  }

  public cards = [
    { img: 'soldier', title: 'Reinforcements from Europe', action: () => {
      console.log('reinforcements coming!');
    }},
    { img: 'horse', title: 'Call in the cavalry', action: () => {
      console.log('Cavalry incoming!');
    }},
    { img: 'horse', title: 'Call in the cavalry', action: () => {
      console.log('Cavalry incoming!');
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

  public map = 'europe';
  public areas;
  public timePerRound = 90000;
  public totalTerritories = 32;

  public timer$ = timer(1000, 1000)
    .pipe(
      map((t) => (1 + t) * 1000),
      take(this.timePerRound / 1000)
    );

  constructor(private cd: ChangeDetectorRef) {}

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
