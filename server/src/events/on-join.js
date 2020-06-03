const addUserToSession = require('../fns/add-user-to-session');
const findSession = require('../fns/find-sessions');
const setSessions = require('../helpers/set-sessions');
const getResponseObject = require('../helpers/get-response-object');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{userId: String}} ev
 * @param {Array} sessions
 */
const fn = function(socket, ev, sessions) {

  const _sessions = {...sessions};

  try {

    let session = findSession(sessions, ev.sessionId);

    if (session) {
      session = addUserToSession(session, ev.userId);
      setSessions(_sessions);
      socket.emit('join_success', getResponseObject(200, session));
    }
    else {
      throw new Error('No active game session, please create your own');
    }
  }
  catch (err) {
    socket.emit('internal_error', getResponseObject(500, null, err.message));
  }
}

module.exports = fn;