/**
 * Finds a game session by id
 * @param {Array} sessions
 */
const fn = function(sessions, id) {

  if (!sessions) {
    throw new Error('Must provide sessions');
  }

  const _sessions = {...sessions};

  return Object.keys(_sessions)
    .map((sessionId) => _sessions[sessionId])
    .find((session) => session.sessionId === id);
}

module.exports = fn;