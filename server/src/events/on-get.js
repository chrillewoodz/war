const getSessionById = require('../fns/get-session-by-id');
const getResponseObject = require('../helpers/get-response-object');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{clientId: String}} ev
 * @param {Array} sessions
 */
const fn = function(socket, ev, sessions) {

  try {
    console.log(ev);
    let session = getSessionById(sessions, ev.sessionId);

    if (session) {
      socket.emit('get_success', getResponseObject(200, session));
    }
    else {
      throw new Error('No game session with that id');
    }
  }
  catch (err) {
    socket.emit('internal_error', getResponseObject(500, null, err.message, 'on-get'));
  }
}

module.exports = fn;