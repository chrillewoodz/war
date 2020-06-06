export interface Faction {
  name: string;
  colorRGB: string;
  colorRGBA: string;
  faction: string;
}

export interface Player {
  id: string;
  state: {
    connected: boolean;
    resigned: boolean;
    quit: boolean;
  };
  faction: {
    name: string;
    colorRGB: string;
    colorRGBA: string;
    faction: string;
  };
}
export interface Army {
  type: 'soldier' | 'horse' | 'gatling-gun' | 'spy';
  power: number;
}

export interface Area {
  areaId: string;
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
  readonly maxPlayers: number;
}

export interface SessionState {
  started: boolean;
  paused: boolean;
  players: Player;
  logs: any[];
  areas: Area[];
  areasReady: boolean;
}

export interface Session {
  readonly sessionId: string;
  readonly settings: SessionSettings;
  state: SessionState;
}

export interface SocketResponse {
  status: number;
  res: Session;
  err: string;
}

export interface PipeResult {
  session: Session;
  readonly self: Player;
}