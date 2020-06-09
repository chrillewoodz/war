class SocketEvents {
  PRE_UPDATE = 'pre_update';
  UPDATE = 'update';
  DELETE = 'delete';
  GET = 'get';
  JOIN = 'join';
  HOST = 'host';
  QUIT = 'quit';
  READY = 'ready';
  STATS = 'stats';
  INTERNAL_ERROR = 'internal_error';

  // Success responses
  PRE_UPDATE_SUCCESS = `${this.PRE_UPDATE}_success`;
  UPDATE_SUCCESS = `${this.UPDATE}_success`;
  DELETE_SUCCESS = `${this.DELETE}_success`;
  GET_SUCCESS = `${this.GET}_success`;
  JOIN_SUCCESS = `${this.JOIN}_success`;
  HOST_SUCCESS = `${this.HOST}_success`;
  QUIT_SUCCESS = `${this.QUIT}_success`;
  STATS_SUCCESS = `${this.STATS}_success`;
}

module.exports = SocketEvents;