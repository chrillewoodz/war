// const AppStorage = require('./app-storage');
const Timer = require('./timer');

class Timers {

  constructor() {
    this.timers = {};
  }

  getTimer(sessionId) {
    return this.timers[sessionId];
  }

  addTimer(sessionId) {
    this.timers[sessionId] = new Timer();
  }

  startTimer(sessionId, onInterval, onFinished) {

    let timer = this.getTimer(sessionId);

    if (!timer) {
      this.addTimer(sessionId);
      timer = this.getTimer(sessionId);
    }

    timer.start(onInterval, onFinished);
  }

  resetTimer(sessionId) {
    this.getTimer(sessionId).reset();
  }

  removeTimer(sessionId) {
    delete this.timers[sessionId];
  }
}

module.exports = Timers;