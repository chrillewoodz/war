const storage = require('node-persist');
const getResponseObject = require('../helpers/get-response-object');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{sessionId: String}} ev
 * @param {Array} sessions
 */
const fn = function(socket, ev, sessions) {

  try {

    let _sessions = { ...sessions };

    delete _sessions[ev.sessionId];

    storage.setItem('sessions', _sessions);
    socket.emit('delete_success', getResponseObject(200, _sessions[ev.sessionId]));
  }
  catch (err) {
    socket.emit('internal_error', getResponseObject(500, null, err.message, 'on-get'));
  }
}

module.exports = fn;