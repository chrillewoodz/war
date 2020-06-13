const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const SessionsStorage = require('../classes/sessions-storage');
const Session = require('../classes/session');
const SocketEvents = require('../classes/socket-events');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{clientId: String}} ev
 * @param {SessionsStorage} storage
 */
const fn = async function(socket, ev, storage) {

  try {

    /**
     * @type {Session}
     */
    const session = await storage.getById(ev.sessionId);

    if (session) {
      socket.emit(SocketEvents.GET_SUCCESS, new SocketResponse(200, session));
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