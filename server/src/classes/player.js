class Player {

  faction = null;

  constructor(clientId, faction) {
    this.clientId = clientId;
    this.faction = faction;
    this.state = {
      connected: true,
      resigned: false,
      quit: false,
      ready: false
    };
  }

  setFaction(faction) {
    this.faction = faction;
  }

  ready() {
    this.state.ready = true;
  }

  resign() {
    this.state.resigned = true;
  }

  quit() {
    this.state.quit = true;
  }

  toJSON() {

    return {
      clientId: this.clientId,
      faction: this.faction,
      state: this.state
    };
  }
}

module.exports = Player;