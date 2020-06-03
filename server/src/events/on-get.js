const findSession = require('../fns/find-sessions');
const getResponseObject = require('../helpers/get-response-object');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{clientId: String}} ev
 * @param {Array} sessions
 */
const fn = function(socket, ev, sessions) {

  try {

    let session = findSession(sessions, ev.sessionId);
    console.log(session);
    if (session) {
      socket.emit('get_success', getResponseObject(200, session));
    }
    else {
      throw new Error('No game session with that id');
    }
  }
  catch (err) {
    socket.emit('internal_error', getResponseObject(500, null, err.message));
  }
}

module.exports = fn;