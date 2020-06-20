const SocketError = require('../classes/socket-error');
const Session = require('../classes/session');
const AppStorage = require('../classes/app-storage');
const SocketEvents = require('../classes/socket-events');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{
 *   sessionId: String
 *   clientId: String
 * }} ev
 * @param {AppStorage} storage
 */
const fn = async function(socket, ev, storage) {

  try {

    /**
     * @type {Session}
     */
    const session = await storage.getById(ev.sessionId);

    if (session) {
      session.updatePlayerActiveState(ev.clientId);
      await storage.set(session);
    }
    else {
      throw new Error('No game session with that id');
    }
  }
  catch (err) {
    console.error(err);
    socket.emit(SocketEvents.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;