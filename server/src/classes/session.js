const { v4 } = require('uuid');
const Player = require('./player');

class Session {

  // props allows the conversion of a stringified storage object
  // back to a Session class
  constructor(props) {
    this.createdAt = props.createdAt || new Date().toISOString();
    this.sessionId = props.sessionId || v4();
    this.settings = props.settings;
    this.state = props.state || {
      started: false,
      paused: false,
      players: {},
      logs: [],
      areas: null,
      areasReady: false
    };
  }

  addPlayer(clientId, faction) {
    this.state.players[clientId] = new Player(clientId, faction);
  }

  playerReady(clientId) {
    this.state.players[clientId].state.ready = true;
  }

  playerQuit(clientId) {

    if (this.state.started) {
      this.state.players[clientId].state.quit = true;
    }
    else {
      delete this.state.players[clientId];
    }
  }

  toJSON() {

    return {
      sessionId: this.sessionId,
      settings: this.settings,
      state: this.state,
      createdAt: this.createdAt
    };
  }
}

module.exports = Session;