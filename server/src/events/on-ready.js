const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const Session = require('../classes/session');
const SessionsStorage = require('../classes/sessions-storage');
const SocketEvents = require('../classes/socket-events');

/**
 *
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param {{
 *   sessionId: String
 *   clientId: String
 * }} ev
 * @param {SessionsStorage} storage
 */
const fn = async function(io, socket, ev, storage) {

  try {

    /**
     * @type {Session}
     */
    const session = await storage.getById(ev.sessionId);

    if (session) {

      if (!session.state.started) {

        session.playerReady(ev.clientId);

        await storage.set(session);

        io.to(session.sessionId).emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, session));
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
    socket.emit(SocketEventsINTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;