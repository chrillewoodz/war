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

  setStartingAreas() {

    const players = Object.keys(this.state.players);
    const shuffledPlayers = players.sort(() => 0.5 - Math.random());
    const areas = this.state.areas;
    console.log(players, shuffledPlayers);
    playersLoop: for (let i = 0; i < shuffledPlayers.length; i++) {

      for (let j = 0; j < areas.length; j++) {

        console.log(this.state.areas[j].isStartingArea);
        if (this.state.areas[j].isStartingArea && this.state.areas[j].state.occupiedBy === null) {
          console.log('if');
          this.state.areas[j].state.occupiedBy = this.state.players[shuffledPlayers[i]];
          console.log(this.state.areas[j]);
          continue playersLoop;
        }
      }
    }
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

  start() {
    this.state.started = true;
    this.setStartingAreas();
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
  }

  checkForReadyPlayers() {

    const playersInGame = Object.keys(this.state.players);
    const minPlayers = this.settings.minPlayers;

    if (playersInGame.length >= minPlayers) {

      const playersNotReady = playersInGame
        .filter((clientId) => {

          if (!this.state.players[clientId].state.ready) {
            return true;
          }
        })
        .length;

      if (playersNotReady === 0) {
        this.start();
      }
    }
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