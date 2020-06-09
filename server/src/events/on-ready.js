const storage = require('node-persist');
const getSessionById = require('../fns/get-session-by-id');
const getResponseObject = require('../helpers/get-response-object');
const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const Session = require('../classes/session');
const SessionsStorage = require('../classes/sessions-storage');
const SocketEvents = require('../classes/socket-events');
const events = new SocketEvents();

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{
 *   sessionId: String
 *   clientId: String
 * }} ev
 * @param {SessionsStorage} storage
 */
const fn = async function(socket, ev, storage) {

  try {

    /**
     * @type {Session}
     */
    const session = await storage.getById(ev.sessionId);

    if (session) {

      if (!session.state.started) {

        session.playerReady(ev.clientId);

        await storage.set(session);

        socket.emit(events.PRE_UPDATE_SUCCESS, new SocketResponse(200, session));
      }
      else {
        throw new Error('Game has already started');
      }
    }
    else {
      throw new Error('No game session with that id');
    }
  }
  catch (err) {
    console.error(err);
    socket.emit(events.INTERNAL_ERROR, new SocketError(500, err.message));
  }
}

module.exports = fn;