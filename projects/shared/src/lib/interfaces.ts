export interface Extras {
  faction: Faction;
}

export interface Faction {
  name: string;
  colorRGB: string;
  colorRGBA: string;
  factionName: string;
}

export interface Armies {
  soldiers: Army;
  horses: Army;
  gatlingGuns: Army;
  spies: Army;
}

export interface PlayerState {
  connected: boolean;
  resigned: boolean;
  quit: boolean;
  ready: boolean;
  defeated: boolean;
  idle: Armies;
}

export interface Player {
  clientId: string;
  state: PlayerState;
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
  type?: ArmyType;
  power?: number;
  amount?: number;
}

export interface Areas {
  [k: string]: {
    name: string;
    connections: number[];
    isStartingArea?: boolean;
  }
}

export interface AreaUI {
  isOwnedBySelf?: boolean;
  screenXY?: DOMPoint;
  power?: number;
  showPowerOn?: boolean;
}

export interface SpiedOnBy {
  [k: string]: Player;
}

export interface AnchorPoint {
  x: number;
  y: number;
}

export interface AnchorPoints {
  main: AnchorPoint;
}

export interface Area {
  areaId: string;
  isStartingArea: boolean;
  points: string;
  name: string;
  anchorPoints: AnchorPoints;
  state: {
    occupiedBy?: Player;
    armies: Armies;
    isActive?: boolean;
    isSelected?: boolean;
    isConnectedToSelected?: boolean;
    spiedOnBy: SpiedOnBy;
    __ui: AreaUI; // Should be omitted when storing the session
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
  lastPopupCoordinates: Pick<MouseEvent, 'clientX' | 'clientY'>;
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
  selected: Area;
  selectedConnection: Area;
  areas: Area[];
  area?: Area;
  mouseEvent?: MouseEvent | Partial<MouseEvent>;
  emitUpdateEvent: boolean;
}

export interface AreaPopupEvent {
  mouseEvent?: MouseEvent | Partial<MouseEvent>;
  area?: Area;
  shouldOpen: boolean;
}

export interface AreaInformationEvent {
  stats: AreaStatsInformation;
}

export interface AreaStatsInformation {
  country: string;
  occupiedBy: Player;
  armies: Armies;
}

export interface ActionEvent {
  areaId: string;
  armies: Armies;
}

export interface OutcomeText {
  color: string;
  label: string;
}

export interface OutcomeConfig {
  image: string;
  title: OutcomeText;
  messages?: OutcomeText[];
}