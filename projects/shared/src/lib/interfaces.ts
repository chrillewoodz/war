export interface Extras {
  faction: Faction;
}

export interface Faction {
  name: string;
  colorRGB: string;
  colorRGBA: string;
  factionName: string;
}

export interface Player {
  clientId: string;
  state: {
    connected: boolean;
    resigned: boolean;
    quit: boolean;
    ready: boolean;
    defeated: boolean;
  };
  extras: {
    faction: Faction;
  }
}
export interface Army {
  type: 'soldier' | 'horse' | 'gatling-gun' | 'spy';
  power: number;
}

export interface Area {
  areaId: number;
  isStartingArea: boolean;
  state: {
    occupiedBy?: Player;
    troops: {
      soldiers: Army;
      horses: Army;
      gatlingGuns: Army;
      spies: Army;
    }
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