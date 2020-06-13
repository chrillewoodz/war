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
  readonly IS_ACTIVE = 'is_active';
  readonly INTERNAL_ERROR = 'internal_error';

  // Success responses
  readonly PRE_UPDATE_SUCCESS = `${this.PRE_UPDATE}_success`;
  readonly UPDATE_SUCCESS = `${this.UPDATE}_success`;
  readonly GET_SUCCESS = `${this.GET}_success`;
  readonly JOIN_SUCCESS = `${this.JOIN}_success`;
  readonly HOST_SUCCESS = `${this.HOST}_success`;
  readonly QUIT_SUCCESS = `${this.QUIT}_success`;
  readonly END_SUCCESS = `${this.END}_success`;
  readonly STATS_SUCCESS = `${this.STATS}_success`;
}