const { v4 } = require('uuid');
const differenceInSeconds = require('date-fns/differenceInSeconds')
const GameMap = require('./game-map');
const Player = require('./player');

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
      areasReady: false,
      currentTurn: null,
      currentSeason: 0, // winter is 0, spring 1, summer 2, autumn 3
      currentRound: 0 // should be increased when all players have played a turn
    };

    this.convertPlayersToClasses();
    this.convertAreasToClass();
  }

  checkWinCondition() {

    for (const playerId in this.state.players) {

      const areAllAreasOwned = this.state.areas.every((area) => {
        return area.occupiedBy && area.occupiedBy.clientId === playerId;
      });

      if (areAllAreasOwned) {
        this.end();
        return true;
      }
    }

    return false;
  }

  changeTurn() {

    if (this.checkWinCondition()) {
      return false;
    }

    const players = Object.keys(this.state.players);

    if (this.state.currentTurn === null) {
      this.state.currentTurn = this.state.players[players[0]];
    }
    else {
      const currentIndex = players.indexOf(this.state.currentTurn.clientId);
      let newIndex;

      switch (currentIndex) {
        case 0: newIndex = 1; break;
        case 1: newIndex = players.length > 2 ? 2 : 0; break;
        case 2: newIndex = players.length > 3 ? 3 : 0; break;
        case 3: newIndex = 0; break;
      }

      if (newIndex === undefined) {
        throw new Error('Could not determine next player turn');
      }

      this.state.currentTurn = this.state.players[players[newIndex]];

      // When all players have played their turn, increase the round tracker
      if (newIndex === 0) {
        this.state.currentRound += 1;

        // Every 3 rounds change the season
        if (this.state.currentRound % 3 === 0 && this.state.currentRound !== 0) {

          switch (this.state.currentSeason) {
            case 0: this.state.currentSeason = 1; break;
            case 1: this.state.currentSeason = 2; break;
            case 2: this.state.currentSeason = 3; break;
            case 3: this.state.currentSeason = 0; break;
          }
        }
      }


      // Also reset the action points
      players.forEach((playerId) => {
        this.state.players[playerId].state.actionPoints.left = 20;
      });
    }

    return true;
  }

  setStartingAreas() {

    const players = Object.keys(this.state.players);
    const shuffledPlayers = players.sort(() => 0.5 - Math.random());
    const areas = this.state.areas.areas;

    playersLoop: for (let i = 0; i < shuffledPlayers.length; i++) {

      for (let j = 0; j < areas.length; j++) {

        if (this.state.areas.areas[j].isStartingArea && this.state.areas.areas[j].state.occupiedBy === null) {
          this.state.areas.areas[j].state.occupiedBy = this.state.players[shuffledPlayers[i]];
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

  prepareMap(points, config) {
    this.state.areas.prepare(points, config);
  }

  start() {
    this.state.started = true;
    this.setStartingAreas();
    this.changeTurn();
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

  checkForReadyPlayers(onAllPlayersReady) {

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
        onAllPlayersReady();
      }
    }
  }

  convertPlayersToClasses() {

    for (const clientId in this.state.players) {
      this.state.players[clientId] = new Player(this.state.players[clientId]);
    }
  }

  convertAreasToClass() {
    this.state.areas = new GameMap(this.state.areas);
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