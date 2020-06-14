class SocketEvents {
  UPDATE = 'update';
  DELETE = 'delete';
  GET = 'get';
  JOIN = 'join';
  HOST = 'host';
  QUIT = 'quit';
  READY = 'ready';
  END = 'end';
  STATS = 'stats';
  START = 'start';
  IS_ACTIVE = 'is_active';
  INTERNAL_ERROR = 'internal_error';

  // Success responses
  UPDATE_SUCCESS = `${this.UPDATE}_success`;
  // DELETE_SUCCESS = `${this.DELETE}_success`;
  GET_SUCCESS = `${this.GET}_success`;
  // JOIN_SUCCESS = `${this.JOIN}_success`;
  // HOST_SUCCESS = `${this.HOST}_success`;
  // QUIT_SUCCESS = `${this.QUIT}_success`;
  // END_SUCCESS = `${this.END}_success`;
  STATS_SUCCESS = `${this.STATS}_success`;
}

module.exports = new SocketEvents();