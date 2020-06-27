export interface Extras {
  faction: Faction;
}

export interface Faction {
  name: string;
  colorRGB: string;
  colorRGBA: string;
  factionName: string;
}

interface Armies {
  soldiers: Army;
  horses: Army;
  gatlingGuns: Army;
  spies: Army;
}

export interface Player {
  clientId: string;
  state: {
    connected: boolean;
    resigned: boolean;
    quit: boolean;
    ready: boolean;
    defeated: boolean;
    armies: Armies;
    idle: Armies;
  };
  extras: {
    faction: Faction;
  }
}

export enum ArmyType {
  Soldiers = 'soldiers',
  Horses = 'horses',
  GatlingGuns = 'gatlingGuns',
  Spies = 'spies'
}

export interface Army {
  type: ArmyType;
  power: number;
  amount?: number;
}

export interface Area {
  areaId: number;
  isStartingArea: boolean;
  points: string;
  name: string;
  state: {
    occupiedBy?: Player;
    armies: Armies;
    isActive?: boolean;
    isSelected?: boolean;
    isConnectedToSelected?: boolean;
    isOwnedBySelf?: boolean;
  }
}

export interface SessionSettings {
  readonly private: boolean;
  readonly minPlayers: number;
  readonly maxPlayers: number;
}

export interface SessionState {
  started: boolean;
  paused: boolean;
  ended: boolean;
  players: {
    [clientId: string]: Player
  };
  logs: any[];
  areas: Area[];
  areasReady: boolean;
  currentTurn?: Player;
  timer?: Timer;
}

export interface Session {
  readonly sessionId: string;
  readonly settings: SessionSettings;
  state: SessionState;
}

export interface SocketResponse<T = Session> {
  status: number;
  data?: T;
  err?: string;
}

export interface PipeResult {
  session: Session;
  readonly self: Player;
}

export interface Timer {
  percent: number;
  elapsed: number;
  milliseconds: number;
  total: number;
}

// TODO: Inherit some from Timer
export interface TimerResponse {
  percent: number;
  milliseconds: number;
  total: number;
  finished: boolean;
}

export interface SelectedEvent {
  areas: Area[];
  area: Area;
  mouseEvent?: MouseEvent;
}

export interface AreaPopupEvent {
  mouseEvent?: MouseEvent;
  area?: Area;
  shouldOpen: boolean;
}

export interface AreaInformationEvent {
  stats: AreaStatsInformation;
}

export interface AreaStatsInformation {
  country: string;
  occupiedBy: Player;
}