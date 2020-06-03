export interface Player {
  id: string;
  state: {
    connected: boolean;
    resigned: boolean;
  };
  faction: {
    name: string;
    colorRGB: string;
    colorRGBA: string;
    faction: string;
  };
}