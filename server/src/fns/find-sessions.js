/**
 * Finds a game session by id or all game sessions that are:
 * - Not started
 * - Not private
 * - Maximum number of players not yet reached
 * @param {Array} sessions
 */
const fn = function(sessions, id) {

  /**
   * Filters out game sessions that are not available to join
   * @param {*} session
   */
  function filterBy(session) {

    const hasStarted = session.hasStarted;
    const isPrivate = session.settings.private;
    const isFull = Object.keys(session.state.players).length === session.settings.maxPlayers;

    return !hasStarted && !isPrivate && !isFull;
  }

  if (!sessions) {
    throw new Error('Must provide sessions');
  }

  if (id) {
    console.log(id);
    console.log(Object.keys(sessions)
    .map((sessionId) => sessions[sessionId]));
    return Object.keys(sessions)
      .map((sessionId) => sessions[sessionId])
      .filter(filterBy)
      .find((session) => session.sessionId === id);
  }

  return Object.keys(sessions)
    .map((sessionId) => sessions[sessionId])
    .filter(filterBy)[0];
}

module.exports = fn;