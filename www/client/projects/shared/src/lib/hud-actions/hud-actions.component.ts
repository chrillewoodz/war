import { HUDLoggerService } from '../hud-logger/hud-logger.service';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap, first, switchMap, map } from 'rxjs/operators';

import { ActionCost } from '../enums';
import { SocketApi } from '../socket.api';
import { GameCache } from '../game.cache';
import { ArmyType, Armies, PipeResult, Area, SessionState, ArmiesToDeploy, GameEvent } from '../interfaces';
import { ActionPointsApi } from '../action-points/action-points.service';
import { Action } from '../enums';
import { GameEngine } from '../game.engine';
import { exhaust, getSelectedAreaFromResult, getSelectedConnectionFromResult, getTotalArmiesFromState, getTotalArmiesInArea, getTotalPowerOfArea, isMyTurn } from '../helpers';

interface Option {
  label: string;
  actionType: Action;
  action: () => void;
  disabled?: boolean;
  cost: number;
}

interface ArmySelectionConfig {
  isOpen: boolean;
  currentAction?: Action;
  armies?: Armies;
}

@Component({
  selector: 'hud-actions',
  templateUrl: './hud-actions.component.html',
  styleUrls: ['./hud-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HUDActionsComponent {
  @Input() set result(result: PipeResult) {

    this._result = result;

    if (!result || !isMyTurn) {
      return;
    }

    // Can't pass this as an input because it becomes undefined before we get the result
    this.isMyTurn = isMyTurn(result);

    this.closeArmySelectionMenu();
    // TODO: Get both using 1 function to avoid double loops
    this.selectedArea = getSelectedAreaFromResult(result);
    this.selectedAreaPower = getTotalPowerOfArea(this.selectedArea);
    this.selectedConnection = getSelectedConnectionFromResult(result);
    this.selectedConnectionPower = getTotalPowerOfArea(this.selectedConnection);

    if (this.options) {

      const isConnectionOwnedBySelf = this.selectedConnection?.state.__ui.isOwnedBySelf;

      this.options = this.options.map((option) => {

        const canPerformAction = this.gameEngine.canPerformAction(result.self, option.actionType);

        if (!canPerformAction || !this.isMyTurn) {
          option.disabled = true;
          return option;
        }

        if (!this.selectedArea) {
          option.disabled = true;
        }
        else if (option.actionType === Action.Attack) {
          if ((!this.selectedConnection || isConnectionOwnedBySelf || getTotalArmiesInArea(this.selectedArea, true) === 0)) {
            option.disabled = true;
          }
          else {
            option.disabled = false;
          }
        }
        else if (option.actionType === Action.Deploy) {
          if (!this.selectedArea || getTotalArmiesFromState(result.self.state.idle) === 0) {
            option.disabled = true;
          }
          else {
            option.disabled = false;
          }
        }
        else if (option.actionType === Action.Move) {

          if (!this.selectedConnection || !isConnectionOwnedBySelf || getTotalArmiesInArea(this.selectedArea) === 0) {
            option.disabled = true;
          }
          else {
            option.disabled = false;
          }
        }
        else if (option.actionType === Action.Spy) {
          if (!this.selectedConnection || isConnectionOwnedBySelf || this.selectedConnection.state.spiedOnBy[this.cache.clientId] || this.selectedArea.state.armies.spies.amount === 0) {
            option.disabled = true;
          }
          else {
            option.disabled = false;
          }
        }

        return option;
      });
    }
  }

  get result() {
    return this._result;
  }

  private _result: PipeResult;

  public isMyTurn: boolean;
  public selectedArea: Area;
  public selectedAreaPower: number;
  public selectedConnection: Area;
  public selectedConnectionPower: number;

  public armySelectionConfig: ArmySelectionConfig = {
    isOpen: false
  }

  public counts = this.fb.group({
    soldiers: [0],
    horses: [0],
    gatlingGuns: [0],
    spies: [0]
  });

  public options: Option[] = [
    {
      label: 'Attack',
      actionType: Action.Attack,
      action: () => this.optionClicked(Action.Attack),
      disabled: true,
      cost: ActionCost.Attack
    },
    {
      label: 'Deploy',
      actionType: Action.Deploy,
      action: () => this.optionClicked(Action.Deploy),
      disabled: true,
      cost: ActionCost.Deploy
    },
    {
      label: 'Move',
      actionType: Action.Move,
      action: () => this.optionClicked(Action.Move),
      disabled: true,
      cost: ActionCost.Move
    },
    {
      label: 'Spy',
      actionType: Action.Spy,
      action: () => this.optionClicked(Action.Spy),
      disabled: true,
      cost: ActionCost.Spy
    }
  ];

  public armies: any[] = [
    {
      type: ArmyType.Soldiers,
      formControl: this.counts.get('soldiers'),
      image: '/assets/SVG/soldiers.svg'
    },
    {
      type: ArmyType.Horses,
      formControl: this.counts.get('horses'),
      image: '/assets/SVG/horses.svg'
    },
    {
      type: ArmyType.GatlingGuns,
      formControl: this.counts.get('gatlingGuns'),
      image: '/assets/SVG/gatlingGuns.svg'
    },
    {
      type: ArmyType.Spies,
      formControl: this.counts.get('spies'),
      image: '/assets/SVG/spies.svg'
    }
  ];

  constructor(
    private apApi: ActionPointsApi,
    private cache: GameCache,
    private logger: HUDLoggerService,
    private fb: FormBuilder,
    private gameEngine: GameEngine,
    private socketApi: SocketApi
  ) {}

  optionClicked(action: Action) {

    if (this.isMyTurn) {

      this.armies = this.armies.map((army) => {

        if (army.type === ArmyType.Soldiers || army.type === ArmyType.Horses || army.type === ArmyType.GatlingGuns) {
          if (action !== Action.Spy) {
            army.shouldShow = true;

            if (this.selectedArea.state.armies[army.type].amount <= 0) {
              army.isDisabled = true;
            }
            else {
              army.isDisabled = false;
            }
          }
          else {
            army.shouldShow = false;
          }
        }
        else if (army.type === ArmyType.Spies) {
          if (action === Action.Spy || action === Action.Move || action === Action.Deploy) {
            army.shouldShow = true;

            if (this.selectedArea.state.armies.spies.amount <= 0) {
              army.isDisabled = true;
            }
            else {
              army.isDisabled = false;
            }
          }
          else {
            army.shouldShow = false;
          }
        }

        return army;
      });

      this.gameEngine.doAction(action)
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
  }

  showCost(cost: number) {
    this.apApi.showCost(cost);
  }

  hideCost() {
    this.apApi.hideCost();
  }

  max(type: ArmyType) {

    let ownedArmiesOfType;

    switch (this.armySelectionConfig.currentAction) {
      case Action.Spy:
        ownedArmiesOfType = this.cache.getSelectedArea().state.armies.spies.amount;
        break;
      default:
        ownedArmiesOfType = this.armySelectionConfig.armies[type].amount;
        break;
    }

    this.counts.get(type).setValue(ownedArmiesOfType);
  }

  min(type: ArmyType) {
    this.counts.get(type).setValue(this.armySelectionConfig.currentAction === Action.Spy ? 1 : 0);
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

    this.gameEngine.preventActions();
    let fn: (armies: ArmiesToDeploy) => Observable<Partial<SessionState>>;

    switch (this.armySelectionConfig.currentAction) {

      case Action.Attack:
        fn = this.gameEngine.attackConfirmed;
        break;

      case Action.Deploy:
        fn = this.gameEngine.deployConfirmed;
        break;

      case Action.Move:
        fn = this.gameEngine.moveConfirmed;
        break;

      case Action.Spy:
        fn = this.gameEngine.spyConfirmed;
        break;

      default: exhaust(this.armySelectionConfig.currentAction);
    }

    fn(this.counts.value).pipe(
      first(),
      switchMap((newState) => {

        const self = this.result.self;

        switch (this.armySelectionConfig.currentAction) {
          case Action.Attack:
            return this.logger.log({
              message: `${this.logger.getColoredString(self.extras.faction.colorRGB, self.extras.faction.name)} is attacking ${this.logger.getColoredString(this.selectedConnection.state.occupiedBy?.extras.faction.colorRGB, this.selectedConnection.name)} !`
            })
            .pipe(
              first(),
              tap(() => {
                this.socketApi.event(true, GameEvent.Attack, {
                  extras: {
                    self: this.cache.self,
                    __outcome: newState.__outcome
                  },
                  affectedAreas: [this.selectedConnection]
                });
              }),
              map(() => newState)
            );
          case Action.Deploy:
            return this.logger.log({
              message: `Reports say reinforcements for ${this.logger.getColoredString(self.extras.faction.colorRGB, self.extras.faction.name)} arrived near ${this.logger.getColoredString(this.selectedArea.state.occupiedBy?.extras.faction.colorRGB, this.selectedArea.name)} ...`,
            })
            .pipe(
              first(),
              map(() => newState)
            );
          case Action.Move:
            return this.logger.log({
              message: `Reports say there was movement of troops around ${this.logger.getColoredString(this.selectedArea.state.occupiedBy?.extras.faction.colorRGB, this.selectedArea.name)} ...`
            })
            .pipe(
              first(),
              map(() => newState)
            );
          case Action.Spy:
            return this.logger.log({
              message: `Rumours around ${this.logger.getColoredString(this.selectedConnection.state.occupiedBy?.extras.faction.colorRGB, this.selectedConnection.name)} are saying that spies might have infiltrated their territory ...`
            })
            .pipe(
              first(),
              map(() => newState)
            );
        }
      }),
      switchMap((newState) => {

        return this.socketApi.update(true, newState).pipe(
          first(),
          tap(() => this.actionComplete())
        );
      })
    )
    .subscribe();
  }

  actionComplete() {
    this.closeArmySelectionMenu();
    this.gameEngine.allowActions();
  }

  closeArmySelectionMenu() {
    this.armySelectionConfig.isOpen = false;
  }

  cancel() {

    if (this.isMyTurn) {
      this.closeArmySelectionMenu();
      const areas = this.gameEngine.resetAreaAndConnections(this.result.session.state.map.areas);
      this.socketApi.update(true, {
        map: {
          areas
        }
      });
    }
  }

  endTurn() {

    if (this.isMyTurn) {

      let self = this.gameEngine.giveCardToSelf();
      const areas = this.gameEngine.resetAreaAndConnections(this.cache.session.state.map.areas);

      self = this.gameEngine.getRandomIdleArmies(self);

      this.socketApi.update(true, {
        map: {
          areas
        },
        players: {
          ...this.cache.session.state.players,
          [this.cache.clientId]: self
        }
      }).pipe(
        first(),
        switchMap(() => this.socketApi.changeTurn(true)),
        first()
      )
      .subscribe();
    }
  }

  isConfirmBtnDisabled() {

    switch (this.armySelectionConfig.currentAction) {
      case Action.Attack:
        return !this.counts.get('soldiers').value && !this.counts.get('horses').value && !this.counts.get('gatlingGuns').value;

      case Action.Deploy:
      case Action.Move:
        return !this.counts.get('soldiers').value && !this.counts.get('horses').value && !this.counts.get('gatlingGuns').value && !this.counts.get('spies').value;

      case Action.Spy:
        return !this.counts.get('spies').value;

      default: exhaust(this.armySelectionConfig.currentAction);
    }
  }

  optionTrackBy(i: number, option: Option) {
    return option.actionType;
  }

  armiesTrackBy(i: number, army: any) {
    return army.type;
  }
}
