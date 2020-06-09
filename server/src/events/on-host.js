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
 *   faction: *
 *   clientId: String
 * }} ev
 * @param {SessionsStorage} storage
 */
const fn = async function(socket, ev, storage) {

  try {

    const session = new Session({ settings: ev.settings });
          session.addPlayer(ev.clientId, ev.faction);

    await storage.set(session);

    socket.emit(events.HOST_SUCCESS, new SocketResponse(200, session));
  }
  catch (err) {
    console.error(err);
    socket.emit(events.INTERNAL_ERROR, new SocketError(500, err.message));
  }
}

module.exports = fn;