/**
 *
 * @param {*} _sessions
 * @param {{
 *   sessionId: String
 * }} _session
 */
const fn = function(_sessions, _session) {

  const playersLeft = Object.keys(_session.state.players)
    .map((clientId) => _session.state.players[clientId])
    .filter((player) => player.state.quit)
    .length;

  if (playersLeft < 2 && _session.state.started) {
    delete _sessions[_session.sessionId];
  }

  return _sessions;
}

module.exports = fn;