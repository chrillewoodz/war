export interface Areas {
  [k: string]: {
    name: string;
    connections: number[];
  }
}

export const MapEuropeConnections: Areas = {
  0: {
    name: 'Crimea (Ukraine)',
    connections: [1, 6]
  },
  1: {
    name: 'Russia',
    connections: [1, 2, 3, 5, 6, 8, 10, 35, 37]
  },
  2: {
    name: 'Estonia',
    connections: [1, 3, 37, 44]
  },
  3: {
    name: 'Latvia',
    connections: [1, 3, 4, 44]
  },
  4: {
    name: 'Lithuania',
    connections: [3, 5, 34, 44]
  },
  5: {
    name: 'Belarus',
    connections: [1, 3, 4, 34, 6]
  },
  6: {
    name: 'Ukraine',
    connections: [0, 1, 5, 7, 32, 33, 34, 39]
  },
  7: {
    name: 'Moldova',
    connections: [6, 39]
  },
  8: {
    name: 'Azerbajdzjan',
    connections: [1, 9, 10]
  },
  9: {
    name: 'Armenia',
    connections: [9, 10, 40]
  },
  10: {
    name: 'Georgia',
    connections: [1, 8, 9, 40]
  },
  11: {
    name: 'Spain',
    connections: [12, 13, 17, 18]
  },
  12: {
    name: 'Portugal',
    connections: [11]
  },
  13: {
    name: 'France',
    connections: [11, 17, 18, 20, 23, 24, 26, 28]
  },
  14: {
    name: 'Iceland',
    connections: [15, 16, 22, 35]
  },
  15: {
    name: 'Ireland',
    connections: [16, 21]
  },
  16: {
    name: 'Northern Ireland',
    connections: [15, 21, 22]
  },
  17: {
    name: 'Corse (Italy)',
    connections: [11, 13, 18, 19, 23]
  },
  18: {
    name: 'Sardegna (Italy)',
    connections: [11, 13, 17, 19, 23]
  },
  19: {
    name: 'Sicilia (Italy)',
    connections: [17, 18, 23]
  },
  20: {
    name: 'England',
    connections: [13, 21, 23, 27, 28, 29, 35]
  },
  21: {
    name: 'Wales',
    connections: [15, 16, 20]
  },
  22: {
    name: 'Scotland',
    connections: [14, 16, 20, 27, 35]
  },
  23: {
    name: 'Italy',
    connections: [13, 17, 18, 19, 24, 25, 41, 42, 43]
  },
  24: {
    name: 'Switzerland',
    connections: [13, 23, 25, 26]
  },
  25: {
    name: 'Austria',
    connections: [23, 24, 26, 32, 33, 43]
  },
  26: {
    name: 'Germany',
    connections: [13, 24, 25, 27, 28, 29, 31, 32, 34]
  },
  27: {
    name: 'Denmark',
    connections: [20, 22, 26, 30, 31]
  },
  28: {
    name: 'Belgium',
    connections: [13, 20, 26, 29]
  },
  29: {
    name: 'Netherlands',
    connections: [20, 26, 28]
  },
  30: {
    name: 'North Jutland (Denmark)',
    connections: [27, 35, 36]
  },
  31: {
    name: 'Region Huvedstaden (Denmark)',
    connections: [26, 27, 36]
  },
  32: {
    name: 'Czechoslovakia',
    connections: [6, 25, 26, 33, 34]
  },
  33: {
    name: 'Hungary',
    connections: [6, 25, 32, 39, 43]
  },
  34: {
    name: 'Poland',
    connections: [4, 5, 6, 26, 32, 36]
  },
  35: {
    name: 'Norway',
    connections: [14, 20, 22, 30, 36]
  },
  36: {
    name: 'Sweden',
    connections: [30, 31, 34, 35, 37, 44]
  },
  37: {
    name: 'Finland',
    connections: [1, 2, 36, 44]
  },
  38: {
    name: 'Bulgaria',
    connections: [39, 40, 41, 43]
  },
  39: {
    name: 'Romania',
    connections: [6, 7, 33, 38, 43]
  },
  40: {
    name: 'Turkey',
    connections: [9, 10, 38, 41]
  },
  41: {
    name: 'Greece',
    connections: [23, 38, 40, 42, 43]
  },
  42: {
    name: 'Albania',
    connections: [23, 41, 43]
  },
  43: {
    name: 'Serbia',
    connections: [23, 25, 33, 38, 39, 41, 42]
  },
  44: {
    name: 'Gotland (Sweden)',
    connections: [2, 3, 4, 34, 36, 37]
  },
}