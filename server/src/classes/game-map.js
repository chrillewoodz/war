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
        state: {
          occupiedBy: null,
          armies: {
            soldiers: null,
            horses: null,
            gatlingGuns: null,
            spies: null
          },
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