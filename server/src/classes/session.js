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
      map: new GameMap(),
      areasReady: false,
      currentTurn: null,
      currentSeason: 0, // winter is 0, spring 1, summer 2, autumn 3
      currentRound: 0 // should be increased when all players have played a turn
    };

    // this.convertPlayersToClasses();
    // this.convertAreasToClass();
  }

  checkWinCondition() {

    for (const playerId in this.state.players) {

      const areAllAreasOwned = this.state.map.areas.every((area) => {
        return area.state.occupiedBy && area.state.occupiedBy.clientId === playerId;
      });

      if (areAllAreasOwned) {
        return this.state.players[playerId];
      }

      if (!this.playerHasAreasLeft(playerId)) {
        this.state.players[playerId].defeated();
      }
    }

    const playersLeft = Object.keys(this.state.players)
      .filter((playerId) => {
        const isActive = this.state.players[playerId].isActivePlayer();
        return isActive;
      });

    if (playersLeft.length > 1) {
      return false;
    }
    else {
      return this.state.players[playersLeft[0]];
    }
  }

  playerHasAreasLeft(playerId) {

    const areasOwned = this.state.map.areas.filter((area) => {

      if (area.state.occupiedBy && area.state.occupiedBy.clientId === playerId) {
        return true;
      }

      return false;
    });

    if (areasOwned.length === 0) {
      return false;
    }

    return true;
  }

  changeTurn() {

    const players = Object.keys(this.state.players)
      .map((playerId) => this.state.players[playerId]);

    if (this.state.currentTurn === null) {
      this.state.currentTurn = players[0];
    }
    else {

      const activePlayers = players.filter((player) => {

        if (player.isActivePlayer()) {
          return true;
        }
      });

      let nextPlayer;

      for (let i = 0; i < activePlayers.length; i++) {

        if (this.state.currentTurn.clientId === activePlayers[i].clientId) {

          const _nextPlayer = activePlayers[i + 1];

          if (_nextPlayer) {
            nextPlayer = _nextPlayer;
            break;
          }
        }
      }

      if (!nextPlayer) {
        this.state.currentTurn = activePlayers[0];
      }
      else {
        this.state.currentTurn = nextPlayer;
      }

      if (this.state.currentTurn === undefined || this.state.currentTurn === null) {
        throw new Error('Could not determine next player turn');
      }

      // When all players have played their turn, increase the round tracker
      if (this.state.currentTurn.clientId === players[0].clientId) {
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
      players.forEach((player) => {
        this.state.players[player.clientId].state.actionPoints.left = 20;
      });
    }
  }

  setStartingAreas() {

    const areas = this.state.map.areas;
    const players = Object.keys(this.state.players).map((clientId) => this.state.players[clientId]);
    const areasLength = areas.length;
    const playersLength = players.length;
    const baseAreasPerPlayerCeil = Math.ceil(areasLength / playersLength); // Used to get modulus
    const baseAreasPerPlayerFloor = Math.floor(areasLength / playersLength); // Used when randomizing areas
    const areasLeft = baseAreasPerPlayerCeil % playersLength;

    function randomizeAreas(player, amount) {

      for (let i = 0; i < amount; i++) {

        const unoccupiedAreas = areas.filter((area) => !area.state.occupiedBy);
        const randomIndex = Math.floor(Math.random() * unoccupiedAreas.length);
        const randomArea = unoccupiedAreas[randomIndex];

        randomArea.state.occupiedBy = player;
      }
    }

    for (let i = 0; i < playersLength; i++) {

      // Have to use the floor value or there will be 1 more area
      // that doesn't exist that we try to assign an occupant to
      let areasToRandomize = baseAreasPerPlayerFloor;

      // Last player should get a slight advantage if
      // there are any areas left since he goes last
      if (i === playersLength - 1) {
        areasToRandomize = baseAreasPerPlayerFloor + areasLeft;
      }

      randomizeAreas(players[i], areasToRandomize);
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

  playerResigned(clientId) {

    if (this.state.started) {
      /**
       * @type {Player}
       */
      const player = this.state.players[clientId];
            player.resign();
    }
    else {
      this.removePlayer(clientId);
    }
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
    this.state.map.prepare(points, config);
  }

  start() {
    this.state.started = true;
    this.setStartingAreas();
    this.setStartingTurn();
  }

  end() {
    this.state.ended = true;
  }

  setStartingTurn() {
    const players = Object.keys(this.state.players);
    this.state.currentTurn = this.state.players[players[0]];
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
      });

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

  convertPlayersToClasses(state) {

    const _state = {...state};

    for (const clientId in _state.players) {
      _state.players[clientId] = new Player(_state.players[clientId]);
    }

    return _state;
  }

  convertAreasToClass(state) {

    const _state = {...state};
          _state.map = new GameMap(state.map.areas);

    return _state;
  }

  setState(newState) {

    let updatedState = this.convertPlayersToClasses(newState);
        updatedState = this.convertAreasToClass(newState);

    this.state = updatedState;
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