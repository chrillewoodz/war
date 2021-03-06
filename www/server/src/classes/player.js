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
      cards: [],
      idle: {
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
      actionPoints: {
        total: 20,
        left: 20
      },
      lastActiveAt: new Date().toISOString()
    };
  }

  addExtras(extras) {
    this.extras = { ...this.extras, extras };
  }

  setLastActiveAt() {
    this.state.lastActiveAt = new Date().toISOString();
  }

  isActivePlayer() {
    return !this.state.defeated && !this.state.resigned && !this.state.quit;
  }

  defeated() {
    this.state.defeated = true;
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