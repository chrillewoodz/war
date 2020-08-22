import { CardsService } from './../game-cards/cards.service';
import { SocketApi } from '../socket.api';
import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { tap, first, switchMap } from 'rxjs/operators';

import { GameCache } from '../game.cache';
import { ArmyType, Armies, PipeResult, Area, SessionState } from '../interfaces';
import { ActionPointsApi } from '../action-points/action-points.service';
import { Action } from '../enums';
import { GameEngine } from '../game.engine';
import { exhaust, getSelectedAreaFromResult, getSelectedConnectionFromResult, getTotalArmiesFromState, getTotalArmiesInArea, getTotalPowerOfArea } from '../helpers';
import { Observable } from 'rxjs';

interface Option {
  label: string;
  actionType: Action;
  action: () => void;
  disabled?: boolean;
}

interface ArmySelectionConfig {
  isOpen: boolean;
  currentAction?: Action;
  armies?: Armies;
}

@Component({
  selector: 'hud-actions',
  templateUrl: './hud-actions.component.html',
  styleUrls: ['./hud-actions.component.scss']
})

export class HUDActionsComponent {
  @Input() isMyTurn: boolean;
  @Input() set result(result: PipeResult) {

    if (!result) {
      return;
    }

    this._result = result;
    this.closeArmySelectionMenu();
    // TODO: Get both using 1 function to avoid double loops
    this.selectedArea = getSelectedAreaFromResult(result);
    this.selectedAreaPower = getTotalPowerOfArea(this.selectedArea);
    this.selectedConnection = getSelectedConnectionFromResult(result);
    this.selectedConnectionPower = getTotalPowerOfArea(this.selectedConnection);

    if (this.options) {

      const isConnectionOwnedBySelf = this.selectedConnection?.state.__ui.isOwnedBySelf;

      this.options = this.options.map((option) => {

        if (!this.selectedArea) {
          option.disabled = true;
        }
        else if (option.actionType === Action.Attack) {
          if ((!this.selectedConnection || isConnectionOwnedBySelf)) {
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
      })
    }
  }

  get result() {
    return this._result;
  }

  private _result: PipeResult;

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
      disabled: true
    },
    {
      label: 'Deploy',
      actionType: Action.Deploy,
      action: () => this.optionClicked(Action.Deploy),
      disabled: true
    },
    {
      label: 'Move',
      actionType: Action.Move,
      action: () => this.optionClicked(Action.Move),
      disabled: true
    },
    {
      label: 'Spy',
      actionType: Action.Spy,
      action: () => this.optionClicked(Action.Spy),
      disabled: true
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
    private cardsService: CardsService,
    private fb: FormBuilder,
    private gameEngine: GameEngine,
    private socketApi: SocketApi
  ) {}

  optionClicked(action: Action) {

    this.armies = this.armies.map((army) => {

      if (army.type === ArmyType.Soldiers || army.type === ArmyType.Horses ||army.type === ArmyType.GatlingGuns) {
        if (action !== Action.Spy) {
          army.shouldShow = true;
        }
        else {
          army.shouldShow = false;
        }
      }
      else if (army.type === ArmyType.Spies) {
        if (action === Action.Spy || action === Action.Move) {
          army.shouldShow = true;
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

    this.gameEngine.preventActions();
    let fn: (Armies) => Observable<Area[]>;

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
      switchMap((areas) => {

        let newState: Partial<SessionState>;

        switch (this.armySelectionConfig.currentAction) {

          case Action.Attack:
          case Action.Move:
          case Action.Spy:
            newState = { areas };
            break;

          case Action.Deploy:
            newState = {
              areas,
              players: {
                ...this.cache.session.state.players,
                [this.cache.clientId]: this.cache.self
              }
            };
            break;

          default: exhaust(this.armySelectionConfig.currentAction);
        }

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
    this.closeArmySelectionMenu();
    const areas = this.gameEngine.resetAreaAndConnections(this.result.session.state.areas);
    this.socketApi.update(true, { areas });
  }

  endTurn() {

    const self = this.gameEngine.giveCardToSelf();
    const areas = this.gameEngine.resetAreaAndConnections(this.cache.session.state.areas);

    this.socketApi.update(true, {
      areas,
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
