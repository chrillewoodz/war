const storage = require('node-persist');
const Session = require('./session');

class AppStorage {

  storage = {
    sessions: {}
  };

  constructor() {}

  getAll() {
    return this.storage.sessions;
  }

  /**
   *
   * @param {String} sessionId
   */
  getById(sessionId) {

    const sessions = this.getAll();

    return Object.keys(sessions)
      .map((sessionId) => sessions[sessionId])
      .find((session) => session.sessionId === sessionId);
  }

  findAll() {

    /**
     * Filters out game sessions that are not available to join
     * @param {*} session
     */
    function filterBy(session) {

      const hasStarted = session.state.started;
      const isPrivate = session.settings.private;
      const isFull = Object.keys(session.state.players).length === session.settings.maxPlayers;

      return !hasStarted && !isPrivate && !isFull;
    }

    const sessions = this.getAll();

    return Object.keys(sessions)
      .map((sessionId) => sessions[sessionId])
      .filter(filterBy);
  }

  /**
   *
   * @param {String} [sessionId]
   */
  find(sessionId) {

    const sessions = this.findAll(sessionId);

    if (sessionId) {
      return sessions.find((session) => session.sessionId === sessionId);
    }
    else {
      return sessions[0];
    }
  }

  /**
   *
   * @param {Session} session
   */
  set(session) {
    const sessions = this.getAll();

    session.lastUpdatedAt = new Date().toISOString();
    sessions[session.sessionId] = session;

    return this.update(sessions);
  }

  update(sessions) {
    this.storage.sessions = sessions;
  }

  /**
   *
   * @param {String} sessionId
   */
  remove(sessionId) {

    try {
      const sessions = this.getAll();
      delete sessions[sessionId];
      return this.update(sessions);
    }
    catch (e) {
      console.log(e);
    }
  }
}

module.exports = AppStorage;