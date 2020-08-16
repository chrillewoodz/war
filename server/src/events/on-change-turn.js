const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const Session = require('../classes/session');
const Timers = require('../classes/timers');
const AppStorage = require('../classes/app-storage');
const SocketEvents = require('../classes/socket-events');

/**
 *
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param {{
 *   sessionId: String
 *   newState: *
 * }} ev
 * @param {AppStorage} storage
 * @param {Timers} timers
 */
const fn = async function(io, socket, ev, storage, timers) {
  console.log('ON_CHANGE_TURN', ev);
  try {

    /**
     * @type {Session}
     */
    const session = await storage.getById(ev.sessionId);

    if (!session) {
      throw new Error('No game session with that id');
    }
    else {

      session.changeTurn();

      timers.startTimer(session.sessionId, async (e) => {
        io.to(session.sessionId).emit(SocketEvents.TIMER_UPDATED, new SocketResponse(200, e));
      }, (e) => {
        io.to(session.sessionId).emit(SocketEvents.TIMER_FINISHED, new SocketResponse(200, e));
      });

      await storage.set(session);

      io.to(ev.sessionId).emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, session));
    }
  }
  catch(err) {
    console.error(err);
    socket.emit(SocketEvents.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;