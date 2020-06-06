/**
 * Finds a game session by id
 * @param {Array} sessions
 */
const fn = function(sessions, id) {

  if (!sessions) {
    throw new Error('Must provide sessions');
  }

  return Object.keys(sessions)
    .map((sessionId) => sessions[sessionId])
    .find((session) => session.sessionId === id);
}

module.exports = fn;