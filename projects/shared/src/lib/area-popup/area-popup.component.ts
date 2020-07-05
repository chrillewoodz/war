import { filter, tap, first } from 'rxjs/operators';
import { AreaPopupService } from './area-popup.service';
import { ArmyType, Armies } from './../interfaces';
import { FormBuilder } from '@angular/forms';
import { Component } from '@angular/core';

import { ActionPointsApi } from '../action-points/action-points.service';
import { Action } from '../enums';
import { GameEngine } from '../game.engine';

interface Option {
  label: string;
  cost: number;
  action: () => void;
}

interface ArmySelectionConfig {
  isOpen: boolean;
  currentAction?: Action;
  armies?: Armies;
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
  public armyTypes = ArmyType;
  public armySelectionConfig: ArmySelectionConfig = {
    isOpen: false
  }

  public counts = this.fb.group({
    soldiers: [0],
    horses: [0],
    gatlingGuns: [0],
    spies: [0]
  });

  constructor(
    private aps: AreaPopupService,
    private apApi: ActionPointsApi,
    private fb: FormBuilder,
    private gameEngine: GameEngine
  ) {

    this.aps.emitter$
      .pipe(
        filter((e) => !!e.area),
        tap(() => {
          this.closeArmySelectionMenu();
        })
      )
      .subscribe(({ mouseEvent, area }) => {

        const areaId = area.areaId;

        if (area.state.isActive) {

          this.options = [];

          if (area.state.__ui.isOwnedBySelf) {
            this.options = [
              { label: 'Deploy troops', cost: 1, action: () => this.optionClicked(Action.Deploy, areaId) },
              { label: 'Relocate troops', cost: 1, action: () => this.optionClicked(Action.Relocate, areaId) }
            ];
          }
          else {
            this.options = [
              { label: 'Attack', cost: 3, action: () => this.optionClicked(Action.Attack, areaId) },
              { label: 'Send spy', cost: 1, action: () => this.optionClicked(Action.Spy, areaId) }
            ];
          }

          if (mouseEvent) {
            this.x = mouseEvent.clientX + 15;
            this.y = mouseEvent.clientY + 15;
            this.isOpen = true;
          }
        }
        else {
          this.isOpen = false;
        }
      }
    );
  }

  optionClicked(action: Action, areaId: string) {

    this.gameEngine.doAction(action, areaId)
      .pipe(
        first(),
        tap(() => {
          this.counts.reset({
            soldiers: 0,
            horses: 0,
            gatlingGuns: 0,
            spies: 0
          });
        })
      )
      .subscribe((actionEvent) => {

        this.armySelectionConfig = {
          isOpen: true,
          armies: actionEvent.armies,
          currentAction: action
        };
      });
  }

  showCost(cost: number) {
    this.apApi.showCost(cost);
  }

  hideCost() {
    this.apApi.hideCost();
  }

  decrease(type: ArmyType) {

    const control = this.counts.get(type);
    const newValue = control.value - 1;

    if (newValue < 0) {
      return;
    }

    control.setValue(newValue);
  }

  increase(type: ArmyType) {

    const control = this.counts.get(type);
    const newValue = control.value + 1;
    const ownedArmiesOfType = this.armySelectionConfig.armies[type].amount;

    if (newValue > ownedArmiesOfType) {
      return;
    }

    control.setValue(newValue);
  }

  confirm() {

    // TODO: Do stuff
    console.log(this.armySelectionConfig.currentAction);
    switch (this.armySelectionConfig.currentAction) {
      case Action.Deploy: this.gameEngine.deployConfirmed(this.counts.value).pipe(
        first(),
        tap(() => this.close())
      ).subscribe(); break;
      // default: exhaust(this.armySelectionConfig.currentAction);
    }
  }

  close() {
    this.isOpen = false;
    this.closeArmySelectionMenu();
  }

  closeArmySelectionMenu() {
    this.armySelectionConfig = {
      isOpen: false
    };
  }
}
