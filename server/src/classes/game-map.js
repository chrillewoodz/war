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
            soldiers: {
              amount: 0
            },
            horses: {
              amount: 0
            },
            gatlingGuns: {
              amount: 0
            },
            spies: {
              amount: 0
            }
          },
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