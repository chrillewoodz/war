import { GameCache } from './../game.cache';
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
  disabled?: boolean;
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
    private cache: GameCache,
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
        const selectedArea = this.cache.getSelectedArea();

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
              {
                label: (() => {

                  if (selectedArea.state.armies.spies.amount === 0) {
                    return 'No spies available'
                  }
                  else if (area.state.spiedOnBy[this.cache.clientId]) {
                    return 'Area intel already aquired'
                  }
                  else {
                    return 'Send spy';
                  }
                })(),
                cost: 1,
                action: () => this.optionClicked(Action.Spy, areaId),
                disabled: selectedArea.state.armies.spies.amount === 0 || !!area.state.spiedOnBy[this.cache.clientId]
              }
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
            spies: action === Action.Spy ? 1 : 0
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
    const min = this.armySelectionConfig.currentAction === Action.Spy ? 1 : 0;

    if (newValue < min) {
      return;
    }

    control.setValue(newValue);
  }

  increase(type: ArmyType) {

    const control = this.counts.get(type);
    const newValue = control.value + 1;
    let ownedArmiesOfType;

    switch (this.armySelectionConfig.currentAction) {
      case Action.Spy:
        ownedArmiesOfType = this.cache.getSelectedArea().state.armies.spies.amount;
        break;
      default:
        ownedArmiesOfType = this.armySelectionConfig.armies[type].amount;
        break;
    }

    if (newValue > ownedArmiesOfType) {
      return;
    }

    control.setValue(newValue);
  }

  confirm() {

    // TODO: Relocate
    switch (this.armySelectionConfig.currentAction) {

      case Action.Attack: this.gameEngine.attackConfirmed(this.counts.value).pipe(
        first(),
        tap(() => this.close())
      ).subscribe();
      break;

      case Action.Deploy: this.gameEngine.deployConfirmed(this.counts.value).pipe(
        first(),
        tap(() => this.close())
      ).subscribe();
      break;

      case Action.Spy: this.gameEngine.spyConfirmed(this.counts.value).pipe(
        first(),
        tap(() => this.close())
      ).subscribe(); break;
      // default: exhaust(this.armySelectionConfig.currentAction);
    }
  }

  deselectConnection() {
    this.gameEngine.resetConnection();
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
