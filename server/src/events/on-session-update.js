const storage = require('node-persist');

/**
 * Updates a session with new state and returns a new session object
 * @param {*} session
 * @param {*} newState
 */
const fn = function(socket, ev, sessions) {

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
      socket.emit('session_updated', _sessions[ev.sessionId]);
    }
  }
  catch(err) {
    socket.emit('internal_error', getResponseObject(500, null, err.message));
  }
}

module.exports = fn;