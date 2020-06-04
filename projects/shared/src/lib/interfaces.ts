import { Player } from './players/players.types';

export interface Session {
  sessionId: string;
  started: boolean;
  paused: boolean;
  settings: {
    private: boolean;
    maxPlayers: number;
  };
  state: {
    players: Player;
    logs: any[];
  };
}

export interface SocketEvent {
  status: number;
  res: Session;
  err: string;
}

export interface PipeResult {
  state: Session;
  readonly self: Player;
}