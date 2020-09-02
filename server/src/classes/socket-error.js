class SocketError {

  status = 500;

  /**
   *
   * @param {String} err
   */
  constructor(err) {
    this.err = err;
  }

  toJSON() {

    return {
      status: this.status,
      err: this.err
    }
  }
}

module.exports = SocketError;