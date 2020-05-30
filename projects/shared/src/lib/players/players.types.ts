export interface Player {
  name: string;
  colorRGB: string;
  colorRGBA: string;
  faction: string;
}

export interface Players {
  '1': Player;
  '2': Player;
  '3': Player;
  '4': Player;
}