const storage = require('node-persist');
const getSessionById = require('../fns/get-session-by-id');
const getResponseObject = require('../helpers/get-response-object');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{
 *   sessionId: String
 *   clientId: String
 * }} ev
 * @param {Array} sessions
 */
const fn = function(socket, ev, sessions) {

  try {

    let _sessions = { ...sessions };
    const _session = {...getSessionById(sessions, ev.sessionId)};

    if (_session) {

      if (_session.state.started) {
        _session.state.players[ev.clientId].state.quit = true;
      }
      else {
        delete _session.state.players[ev.clientId];
      }

      _sessions = { ...sessions, [ev.sessionId]: _session };
      storage.setItem('sessions', _sessions);
      socket.emit('quit_success', getResponseObject(200, _sessions[ev.sessionId]));
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