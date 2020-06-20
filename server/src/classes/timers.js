const AppStorage = require('./app-storage');
const Timer = require('./timer');

class Timers {

  constructor() {
    this.timers = {};
  }

  /**
   * Retrieves and sets any stored timers from the app storage
   * @param {AppStorage} storage
   */
  async init(storage) {
    this.timers = await storage.getTimers();
  }

  getTimer(sessionId) {
    return this.timers[sessionId];
  }

  addTimer(sessionId) {
    this.timers[sessionId] = new Timer();
  }

  startTimer(sessionId, onInterval, onFinished) {
    this.getTimer(sessionId).start(onInterval, onFinished, false);
  }

  resumeTimer(sessionId, onInterval, onFinished) {
    this.getTimer(sessionId).start(onInterval, onFinished, true);
  }

  pauseTimer(sessionId) {
    this.getTimer(sessionId).pause();
  }

  resetTimer(sessionId) {
    this.getTimer(sessionId).reset();
  }

  removeTimer(sessionId) {
    delete this.timers[sessionId];
  }

  toJSON() {
    return {
      timers: this.timers
    };
  }
}

module.exports = Timers;