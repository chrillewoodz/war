class Stats {

  connections = 0;

  constructor() {}

  get() {

    return {
      connections: this.connections
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