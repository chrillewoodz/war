import { ActionPointsApi } from './../action-points/action-points.service';
import { Component, HostListener, Renderer2, Input } from '@angular/core';
import { AreaStatsService } from '../area-information/area-stats.service';

enum Action {
  Attack,
  Spy
}

@Component({
  selector: 'area-popup',
  templateUrl: './area-popup.component.html',
  styleUrls: ['./area-popup.component.scss']
})

export class AreaPopupComponent {
  @Input() areas: any[];

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: MouseEvent) {

    if ((e.target as any).dataset.areaId) {
      this.previouslyClickedElement?.classList.remove('selected');
      this.x = e.clientX + 15;
      this.y = e.clientY + 15;
      this.isOpen = true;
      this.renderer.addClass(e.target, 'selected');
      this.previouslyClickedElement = (e.target as any);
    }
  }

  public x: number;
  public y: number;
  public actions = Action;
  public isOpen = false;

  private previouslyClickedElement: HTMLElement;

  constructor(private renderer: Renderer2, private apApi: ActionPointsApi) {}

  showCost(cost: number) {
    this.apApi.showCost(cost);
  }

  hideCost() {
    this.apApi.hideCost();
  }

  action(action: Action) {

    switch (action) {
      case Action.Attack: this.attack(); break;
      case Action.Spy: this.spy(); break;
    }
  }

  attack() {
    // TODO: Emit attack event
  }

  spy() {
    // TODO: Emit spy event
  }

  close() {
    this.isOpen = false;
    this.previouslyClickedElement?.classList.remove('selected');
  }
}
