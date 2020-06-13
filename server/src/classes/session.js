const { v4 } = require('uuid');
const Player = require('./player');
const differenceInSeconds = require('date-fns/differenceInSeconds')

class Session {

  // props allows the conversion of a stringified storage object
  // back to a Session class
  constructor(props) {
    this.createdAt = props.createdAt || new Date().toISOString();
    this.lastUpdatedAt = props.lastUpdatedAt || new Date().toISOString();
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

    this.convertPlayersToClasses();
  }

  addPlayer(clientId, extras) {
    this.state.players[clientId] = new Player({ clientId, extras });
  }

  updatePlayerActiveState(clientId) {

    /**
     * @type {Player}
     */
    const player = this.state.players[clientId];
          player.setLastActiveAt();
  }

  playerReady(clientId) {

    /**
     * @type {Player}
     */
    const player = this.state.players[clientId];
          player.ready();
  }

  playerQuit(clientId) {

    if (this.state.started) {
      /**
       * @type {Player}
       */
      const player = this.state.players[clientId];
            player.quit();
    }
    else {
      this.removePlayer(clientId);
    }
  }

  end() {
    this.state.ended = true;
  }

  removePlayer(clientId) {
    delete this.state.players[clientId];
  }

  activePlayersLeft() {

    const activePlayersLeft = Object.keys(this.state.players)
      .map((clientId) => this.state.players[clientId])
      .filter((player) => {

        const isResigned = player.state.resigned;
        const hasQuit = player.state.quit;
        const isDefeated = player.state.defeated;
        const lastActiveAt = new Date(player.state.lastActiveAt);
        const now = Date.now();
        const diff = differenceInSeconds(now, lastActiveAt);
        let isInactive;

        if (diff > 30) {
          isInactive = true;
        }
        else {
          isInactive = false;
        }

        return !isResigned && !hasQuit && !isDefeated && !isInactive;
      })
      .length;

    return activePlayersLeft;

    // if (this.state.started && activePlayersLeft >= 2) {
    //   return true;
    // }
    // // Allow pending games with at least 1 player to continue to stay open
    // else if (!this.state.started && activePlayersLeft >= 1) {
    //   return true;
    // }

    // return false;
  }

  convertPlayersToClasses() {

    for (const clientId in this.state.players) {
      this.state.players[clientId] = new Player(this.state.players[clientId]);
    }
  }

  toJSON() {

    return {
      sessionId: this.sessionId,
      settings: this.settings,
      state: this.state,
      createdAt: this.createdAt,
      lastUpdatedAt: this.lastUpdatedAt
    };
  }
}

module.exports = Session;