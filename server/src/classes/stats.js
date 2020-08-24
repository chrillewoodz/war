const AppStorage = require('./app-storage');

class Stats {

  connections = 0;

  constructor() {}

  /**
   *
   * @param {AppStorage} storage
   */
  get(io, storage) {

    var srvSockets = io.sockets.sockets;

    return {
      connections: Object.keys(srvSockets).length,
      gamesTotal: Object.keys(storage.getAll()).length,
      gamesAvailable: Object.keys(storage.findAll()).length
    }
  }

  connected() {
    this.connections = this.connections + 1;
  }

  disconnected() {
    this.connections = this.connections - 1;
  }
}

module.exports = Stats;