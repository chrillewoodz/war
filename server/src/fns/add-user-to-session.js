const initialUserState = require('./initial-user-state');

/**
 *
 * @param {*} session
 * @param {String} clientId
 */
const fn = function(session, clientId) {

  const _session = session;

  _session.state.players[clientId] = initialUserState(clientId);

  return _session;
}

module.exports = fn;