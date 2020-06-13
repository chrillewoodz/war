const storage = require('node-persist');
const Player = require('../classes/player');
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

  async findAll() {

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

    return Object.keys(sessions)
      .map((sessionId) => sessions[sessionId])
      .filter(filterBy);
  }

  /**
   *
   * @param {String} [sessionId]
   */
  async find(sessionId) {

    const sessions = await this.findAll(sessionId);

    if (sessionId) {
      return new Session(sessions.find((session) => session.sessionId === sessionId));
    }

    return new Session(sessions[0]);
  }

  /**
   *
   * @param {Session} session
   */
  async set(session) {
    const sessions = await this.getAll();
    sessions[session.sessionId] = { ...session, lastUpdatedAt: new Date().toISOString() };
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

    try {
      const sessions = await this.getAll();
      delete sessions[sessionId];
      return await this.update(sessions);
    }
    catch (e) {
      console.log(e);
    }
  }
}

module.exports = SessionsStorage;