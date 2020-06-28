import { filter } from 'rxjs/operators';
import { AreaPopupService } from './area-popup.service';
import { ArmyType } from './../interfaces';
import { GameCache } from './../game.cache';
import { FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';
import { Component, HostListener, Input } from '@angular/core';

import { ActionPointsApi } from '../action-points/action-points.service';
import { Action } from '../enums';
import { GameEngine } from '../game.engine';

interface Option {
  label: string;
  cost: number;
  action: () => void;
}

@Component({
  selector: 'area-popup',
  templateUrl: './area-popup.component.html',
  styleUrls: ['./area-popup.component.scss']
})

export class AreaPopupComponent {

  public options: Option[] = [];
  public x: number;
  public y: number;
  public actions = Action;
  public isOpen = false;
  public isArmySelectionMenuOpen = false;
  public armyTypes = ArmyType;

  public counts = this.fb.group({
    soldiers: [1],
    horses: [1],
    gatlingGuns: [1]
  });

  constructor(
    private aps: AreaPopupService,
    private apApi: ActionPointsApi,
    private cache: GameCache,
    private fb: FormBuilder,
    private gameEngine: GameEngine
  ) {

    this.aps.emitter$
      .pipe(
        filter((e) => !!e.area)
      )
      .subscribe(({ mouseEvent, area }) => {

        const areaId = area.areaId;

        if (area.state.isActive) {

          this.options = [];

          if (area.state.__ui.isOwnedBySelf) {
            this.options = [
              { label: 'Deploy troops', cost: 1, action: () => this.optionClicked(Action.Deploy, areaId) },
              { label: 'Relocate troops', cost: 1, action: () => this.gameEngine.doAction(Action.Relocate, areaId) }
            ];
          }
          else {
            this.options = [
              { label: 'Attack', cost: 3, action: () => this.optionClicked(Action.Attack, areaId) },
              { label: 'Send spy', cost: 1, action: () => this.gameEngine.doAction(Action.Spy, areaId) }
            ];
          }

          this.x = mouseEvent.clientX + 15;
          this.y = mouseEvent.clientY + 15;
          this.isOpen = true;
        }
        else {
          this.isOpen = false;
        }
      }
    );
  }

  optionClicked(action: Action, areaId: string) {
    this.gameEngine.doAction(action, areaId);
    this.isArmySelectionMenuOpen = true;
  }

  showCost(cost: number) {
    this.apApi.showCost(cost);
  }

  hideCost() {
    this.apApi.hideCost();
  }

  openArmySelectionMenu() {
    this.isArmySelectionMenuOpen = true;
  }

  decrease(type: ArmyType) {

    const control = this.counts.get(type);
    const newValue = control.value - 1;

    if (newValue < 0) {
      return;
    }

    control.setValue(control.value - 1);
  }

  increase(type: ArmyType) {

    const control = this.counts.get(type);
    const newValue = control.value + 1;
    const ownedArmiesOfType = this.cache.self.state.armies[type].amount;

    // TODO: Check with the attacking army, not the total count
    if (newValue > ownedArmiesOfType) {
      return;
    }

    control.setValue(newValue);
  }

  confirm() {

    // TODO: Do stuff
    this.close();
  }

  close() {
    this.isOpen = false;
    this.closeArmySelectionMenu();
  }

  closeArmySelectionMenu() {
    this.isArmySelectionMenuOpen = false;
  }
}
