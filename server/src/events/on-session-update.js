const storage = require('node-persist');
const getResponseObject = require('../helpers/get-response-object');

/**
 * Updates a session with new state and returns a new session object
 * @param {*} session
 * @param {{
 *   sessionId: String
 *   newState: *
 * }} ev
 * @param {Array} sessions
 */
const fn = function(socket, ev, sessions, event) {

  try {

    // Make it immutable
    let _sessions = { ...sessions };

    // Get the current session
    const session = _sessions[ev.sessionId];

    if (!session) {
      throw new Error('No game session with that id');
    }
    else {

      // Replace current session state with the new state
      const _session = { ...session, state: { ...ev.newState } };

      // Re-set the session in the immutable sessions object
      _sessions = { ..._sessions, [ev.sessionId]: _session };

      storage.setItem('sessions', _sessions);
      socket.emit(event, getResponseObject(200, _sessions[ev.sessionId]));
    }
  }
  catch(err) {
    socket.emit('internal_error', getResponseObject(500, null, err.message, 'on-session-update'));
  }
}

module.exports = fn;