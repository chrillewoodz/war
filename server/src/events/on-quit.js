const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const Session = require('../classes/session');
const AppStorage = require('../classes/app-storage');
const SocketEvents = require('../classes/socket-events');

/**
 *
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param {{
 *   sessionId: String
 *   clientId: String
 * }} ev
 * @param {AppStorage} storage
 */
const fn = function(io, socket, ev, storage) {

  try {

    /**
     * @type {Session}
     */
    const session = storage.getById(ev.sessionId);

    if (session) {

      session.playerQuit(ev.clientId);
      socket.leave(session.sessionId);

      const activePlayersLeft = session.activePlayersLeft();

      if (activePlayersLeft === 1) {
        session.end();
        storage.set(session);
      }
      else if (activePlayersLeft === 0) {
        storage.remove(session.sessionId);
      }

      io.to(session.sessionId).emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, session));
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