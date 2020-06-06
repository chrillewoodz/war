const BaseEvent = {
  PRE_UPDATE: 'pre_update',
  UPDATE: 'update',
  GET: 'get',
  JOIN: 'join',
  HOST: 'host',
  QUIT: 'quit',
  STATS: 'stats',
  INTERNAL_ERROR: 'internal_error'
}

const SuccessEvent = {
  PRE_UPDATE_SUCCESS: 'pre_update_success',
  UPDATE_SUCCESS: 'update_success',
  GET_SUCCESS: 'get_success',
  JOIN_SUCCESS: 'join_success',
  HOST_SUCCESS: 'host_success',
  QUIT_SUCCESS: 'quit_success',
  STATS_SUCCESS: 'stats_success'
}

export const SocketEvents = {
  PRE_UPDATE: BaseEvent.PRE_UPDATE,
  UPDATE: BaseEvent.UPDATE,
  GET: BaseEvent.GET,
  JOIN: BaseEvent.JOIN,
  HOST: BaseEvent.HOST,
  QUIT: BaseEvent.QUIT,
  STATS: BaseEvent.STATS,
  INTERNAL_ERROR: BaseEvent.INTERNAL_ERROR,
  PRE_UPDATE_SUCCESS: SuccessEvent.PRE_UPDATE_SUCCESS,
  UPDATE_SUCCESS: SuccessEvent.UPDATE_SUCCESS,
  GET_SUCCESS: SuccessEvent.GET_SUCCESS,
  JOIN_SUCCESS: SuccessEvent.JOIN_SUCCESS,
  HOST_SUCCESS: SuccessEvent.HOST_SUCCESS,
  QUIT_SUCCESS: SuccessEvent.QUIT_SUCCESS,
  STATS_SUCCESS: SuccessEvent.STATS_SUCCESS
}