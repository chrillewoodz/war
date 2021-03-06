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
  CHANGE_TURN = 'change_turn';
  LOG_MESSAGE = 'log_message';
  GAME_EVENT = 'game_event';
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

  // Others
  TIMER_PAUSE = 'timer_pause';
  TIMER_RESUME = 'timer_resume';
  TIMER_RESTART = 'timer_restart';
  TIMER_UPDATED = 'timer_updated';
  TIMER_FINISHED = 'timer_finished';
}

module.exports = new SocketEvents();