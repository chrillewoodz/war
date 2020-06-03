const initialUserState = require('./initial-user-state');

/**
 *
 * @param {*} session
 * @param {String} userId
 */
const fn = function(session, userId) {

  const _session = session;

  _session.state.players[userId] = initialUserState(userId);

  return _session;
}

module.exports = fn;