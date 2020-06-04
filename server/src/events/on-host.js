const createSession = require('../fns/create-session');
const findSession = require('../fns/find-sessions');
const setSessions = require('../helpers/set-sessions');
const getResponseObject = require('../helpers/get-response-object');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{clientId: String}} ev
 * @param {Function} onSessionsShouldUpdate
 */
const fn = async function(socket, ev, sessions) {

  const _sessions = {...sessions};

  try {

    const cachedSessionId = ev.cachedSessionId;
    let session;

    if (cachedSessionId) {
      session = findSession(_sessions, cachedSessionId);
    }

    if (!session) {
      session = createSession(ev.clientId, ev.settings);
    }

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
    socket.emit('internal_error', getResponseObject(500, null, err.message, 'on-host'));
  }
}

module.exports = fn;