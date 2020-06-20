const NanoTimer = require('nanotimer');

class Timer {

  constructor(props = {}) {
    console.log(Math.random() * 100)
    this.timer = new NanoTimer();
    this.elapsed = props.elapsed || 0;
    this.interval = props.interval || 1000;
    this.total = props.total || 10000;
    this.percent = props.percent || 0;
  }

  /**
   *
   * @param {() => void} onInterval
   * @param {() => void} onFinished
   * @param {boolean} isResume
   */
  start(onInterval, onFinished, isResume) {

    if (!onInterval || !onFinished) {
      throw new Error('Both callbacks [onInterval, onFinished] must be provided');
    }

    this.timer.setInterval(() => {
      this.elapsed += this.interval;
      this.percent = (this.elapsed / this.total) * 100;
      onInterval(this.getResponse());
    }, '', `${this.interval}m`);

    this.timer.setTimeout(() => {
      this.timer.clearInterval();
      this.timer.clearTimeout();
      onFinished(this.getResponse());
    }, [this.timer], `${isResume ? this.total - this.elapsed : this.total}m`);
  }

  pause() {
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

  toJSON() {
    return {
      percent: this.percent,
      elapsed: this.elapsed,
      interval: this.interval,
      total: this.total
    };
  }
}

module.exports = Timer;