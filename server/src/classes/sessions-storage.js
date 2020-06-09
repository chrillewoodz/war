const storage = require('node-persist');
const Session = require('../classes/session');

class SessionsStorage {

  constructor() {}

  async init() {
    return await storage.init();
  }

  async getAll() {
    return await storage.getItem('sessions') || {};
  }

  /**
   *
   * @param {String} sessionId
   */
  async getById(sessionId) {
    const sessions = await this.getAll();
    return new Session(
      Object.keys(sessions)
        .map((sessionId) => sessions[sessionId])
        .find((session) => session.sessionId === sessionId)
    );
  }

  /**
   *
   * @param {String} [sessionId]
   */
  async find(sessionId) {

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

    const sessions = await this.getAll();

    if (sessionId) {
      return new Session(
        Object.keys(sessions)
          .map((sessionId) => sessions[sessionId])
          .filter(filterBy)
          .find((session) => session.sessionId === sessionId)
      );
    }

    return new Session(
      Object.keys(sessions)
        .map((sessionId) => sessions[sessionId])
        .filter(filterBy)[0]
    );
  }

  /**
   *
   * @param {Session} session
   */
  async set(session) {
    const sessions = await this.getAll();
    sessions[session.sessionId] = session;
    return await this.update(sessions);
  }

  async update(sessions) {
    return await storage.setItem('sessions', sessions);
  }

  /**
   *
   * @param {String} sessionId
   */
  async remove(sessionId) {
    const sessions = await this.getAll();
    delete sessions[sessionId];
    return await this.update(sessions);
  }

  /**
   *
   * @param {Session} session
   */
  async cleanup(session) {

    const playersLeft = Object.keys(session.state.players)
      .map((clientId) => session.state.players[clientId])
      .filter((player) => player.state.quit)
      .length;

    if (playersLeft < 2 && session.state.started) {
      return await this.remove(session.sessionId);
    }

    return new Promise((res) => res());
  }
}

module.exports = SessionsStorage;