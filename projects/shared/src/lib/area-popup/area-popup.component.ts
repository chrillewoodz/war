import { Component, HostListener, Input } from '@angular/core';

import { ActionPointsApi } from '../action-points/action-points.service';
import { Action } from '../enums';
import { GameEngine } from '../game.engine';

interface Option {
  label: string;
  cost: number;
  action: void;
}

@Component({
  selector: 'area-popup',
  templateUrl: './area-popup.component.html',
  styleUrls: ['./area-popup.component.scss']
})

export class AreaPopupComponent {
  @Input() areas: any[];
  @Input() activeAreas: any[];

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {

    const target: HTMLElement = e.target as HTMLElement;

    if (target.dataset.areaId && target.classList.contains('active')) {

      this.options = [];

      if (target.classList.contains('owned')) {
        this.options = [
          { label: 'Deploy troops', cost: 1, action: this.gameEngine.doAction(Action.Deploy) },
          { label: 'Relocate troops', cost: 1, action: this.gameEngine.doAction(Action.Relocate) }
        ];
      }
      else {
        this.options = [
          { label: 'Attack', cost: 3, action: this.gameEngine.doAction(Action.Attack) },
          { label: 'Send spy', cost: 1, action: this.gameEngine.doAction(Action.Spy) }
        ];
      }

      this.x = e.clientX + 15;
      this.y = e.clientY + 15;
      this.isOpen = true;
      console.log(this);
    }
    else {
      this.isOpen = false;
      console.log('else');
    }
  }

  public options: Option[] = [];
  public x: number;
  public y: number;
  public actions = Action;
  public isOpen = false;

  constructor(
    private apApi: ActionPointsApi,
    private gameEngine: GameEngine
  ) {}

  showCost(cost: number) {
    this.apApi.showCost(cost);
  }

  hideCost() {
    this.apApi.hideCost();
  }

  close() {
    this.isOpen = false;
  }
}
