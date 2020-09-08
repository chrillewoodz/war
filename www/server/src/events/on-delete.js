const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const AppStorage = require('../classes/app-storage');
const SocketEvents = require('../classes/socket-events');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{sessionId: String}} ev
 * @param {AppStorage} storage
 */
const fn = function(socket, ev, storage) {

  try {

    storage.remove(ev.sessionId);

    socket.emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, null));
  }
  catch (err) {
    console.error(err);
    socket.emit(SocketEvents.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;