const NanoTimer = require('nanotimer');

class Timer {

  constructor(props = {}) {
    this.timer = new NanoTimer();
    this.elapsed = props.elapsed || 0;
    this.interval = props.interval || 1000;
    this.total = props.total || 90000;
    this.percent = props.percent || 0;
  }

  /**
   *
   * @param {() => void} onInterval
   * @param {() => void} onFinished
   */
  start(onInterval, onFinished) {

    if (!onInterval || !onFinished) {
      throw new Error('Both callbacks [onInterval, onFinished] must be provided');
    }

    this.stop();
    this.reset();

    this.timer.setInterval(() => {
      this.elapsed += this.interval;
      this.percent = (this.elapsed / this.total) * 100;
      onInterval(this.getResponse());
    }, '', `${this.interval}m`);

    this.timer.setTimeout(() => {
      this.timer.clearInterval();
      this.timer.clearTimeout();
      onFinished(this.getResponse());
    }, [this.timer], `${this.total}m`);
  }

  stop() {
    this.timer.clearInterval();
    this.timer.clearTimeout();
  }

  reset() {
    this.elapsed = 0;
    this.percent = 0;
  }

  getResponse() {

    return {
      percent: this.percent,
      milliseconds: this.elapsed,
      total: this.total
    }
  }
}

module.exports = Timer;