const AppStorage = require('./app-storage');

class Stats {

  connections = 0;

  constructor() {}

  /**
   *
   * @param {AppStorage} storage
   */
  async get(io, storage) {

    var srvSockets = io.sockets.sockets;

    return {
      connections: Object.keys(srvSockets).length,
      gamesTotal: Object.keys(await storage.getAll()).length,
      gamesAvailable: Object.keys(await storage.findAll()).length
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