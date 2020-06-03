const createSession = require('../fns/create-session');
const setSessions = require('../helpers/set-sessions');
const getResponseObject = require('../helpers/get-response-object');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{userId: String}} ev
 * @param {Function} onSessionsShouldUpdate
 */
const fn = async function(socket, ev, sessions) {

  const _sessions = {...sessions};

  try {
    const session = createSession(ev.userId, ev.settings);

    if (session) {
      _sessions[session.sessionId] = session;
      await setSessions(_sessions);
      socket.emit('host_success', getResponseObject(200, session));
    }
    else {
      throw new Error('Could not create game session');
    }
  }
  catch (err) {
    socket.emit('internal_error', getResponseObject(500, null, err.message));
  }
}

module.exports = fn;