class GameMap {

  constructor(areas) {
    this.areas = areas || [];
  }

  prepare(points, config) {
    console.log(points, config);
    this.areas = points.map((points, areaId) => {

      return {
        areaId: areaId.toString(),
        points,
        name: config[areaId].name,
        isStartingArea: config[areaId].isStartingArea,
        anchorPoints: config[areaId].anchorPoints,
        state: {
          occupiedBy: null,
          armies: config[areaId].armies,
          spiedOnBy: {},
          isActive: false,
          isSelected: false,
          isConnectedToSelected: false,
          isOwnedBySelf: false
        }
      }
    });
  }

  toJSON() {
    return this.areas;
  }
}

module.exports = GameMap;