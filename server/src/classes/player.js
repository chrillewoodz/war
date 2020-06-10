class Player {

  constructor(clientId, extras) {
    this.clientId = clientId;
    this.extras = extras || {};
    this.state = {
      connected: true,
      resigned: false,
      quit: false,
      ready: false
    };
  }

  addExtras(extras) {
    this.extras = { ...this.extras, extras };
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
      extras: this.extras,
      state: this.state
    };
  }
}

module.exports = Player;