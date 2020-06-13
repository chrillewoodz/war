class Player {

  constructor(props) {
    this.clientId = props.clientId;
    this.extras = props.extras || {};
    this.state = props.state || {
      connected: true,
      resigned: false,
      quit: false,
      ready: false,
      defeated: false,
      lastActiveAt: new Date().toISOString()
    };
  }

  addExtras(extras) {
    this.extras = { ...this.extras, extras };
  }

  setLastActiveAt() {
    this.state.lastActiveAt = new Date().toISOString();
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