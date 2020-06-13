const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const SessionsStorage = require('../classes/sessions-storage');
const SocketEvents = require('../classes/socket-events');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{sessionId: String}} ev
 * @param {SessionsStorage} storage
 */
const fn = async function(socket, ev, storage) {

  try {

    await storage.remove(ev.sessionId);

    socket.emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, null));
  }
  catch (err) {
    console.error(err);
    socket.emit(SocketEvents.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;