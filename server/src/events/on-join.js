const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const SessionsStorage = require('../classes/sessions-storage');
const Session = require('../classes/session');
const SocketEvents = require('../classes/socket-events');
const events = new SocketEvents();

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{
 *   faction: *
 *   clientId: String
 * }} ev
 * @param {SessionsStorage} storage
 */
const fn = async function(socket, ev, storage) {

  try {

    // It will only try to find a session by its sessionId if
    // ev.sessionId is defined
    /**
     * @type {Session}
     */
    const session = await storage.find(ev.sessionId);

    if (session) {

      session.addPlayer(ev.clientId, ev.faction);

      await storage.set(session);

      socket.emit(events.JOIN_SUCCESS, new SocketResponse(200, session));
    }
    else {
      throw new Error('No active game session, please create your own');
    }
  }
  catch (err) {
    console.error(err);
    socket.emit(events.INTERNAL_ERROR, new SocketError(500, err.message));
  }
}

module.exports = fn;