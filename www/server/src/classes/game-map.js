class GameMap {

  constructor(areas) {
    this.areas = areas || [];
  }

  prepare(points, config) {

    this.areas = points.map((points, areaId) => {

      return {
        areaId: areaId.toString(),
        points,
        name: config[areaId].name,
        isStartingArea: config[areaId].isStartingArea,
        anchorPoints: config[areaId].anchorPoints,
        connections: config[areaId].connections,
        events: config[areaId].events,
        state: {
          occupiedBy: null,
          armies: config[areaId].armies,
          spiedOnBy: {},
          immunities: {},
          isActive: false,
          isSelected: false,
          isConnectedToSelected: false
        }
      }
    });
  }

  toJSON() {
    return {
      areas: this.areas
    };
  }
}

module.exports = GameMap;