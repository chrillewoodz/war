export class SocketEvents {
  readonly PRE_UPDATE = 'pre_update';
  readonly UPDATE = 'update';
  readonly GET = 'get';
  readonly JOIN = 'join';
  readonly HOST = 'host';
  readonly QUIT = 'quit';
  readonly READY = 'ready';
  readonly END = 'end';
  readonly STATS = 'stats';
  readonly CHANGE_TURN = 'change_turn';
  readonly IS_ACTIVE = 'is_active';
  readonly INTERNAL_ERROR = 'internal_error';

  // Success responses
  // readonly PRE_UPDATE_SUCCESS = `${this.PRE_UPDATE}_success`;
  readonly UPDATE_SUCCESS = `${this.UPDATE}_success`;
  readonly GET_SUCCESS = `${this.GET}_success`;
  // readonly JOIN_SUCCESS = `${this.JOIN}_success`;
  // readonly HOST_SUCCESS = `${this.HOST}_success`;
  // readonly QUIT_SUCCESS = `${this.QUIT}_success`;
  // readonly END_SUCCESS = `${this.END}_success`;
  readonly STATS_SUCCESS = `${this.STATS}_success`;

  // Others
  readonly TIMER_PAUSE = 'timer_pause';
  readonly TIMER_RESTART = 'timer_restart';
  readonly TIMER_RESUME = 'timer_resume';
  readonly TIMER_UPDATED = 'timer_updated';
  readonly TIMER_FINISHED = 'timer_finished';
}