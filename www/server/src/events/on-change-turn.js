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
const fn = function(io, socket, ev, storage, timers) {

  try {

    /**
     * @type {Session}
     */
    const session = storage.getById(ev.sessionId);

    if (!session) {
      throw new Error('No game session with that id');
    }
    else {

      const winner = session.checkWinCondition();

      if (winner) {
        session.state.winner = winner;
        session.end();
        storage.set(session);
        io.to(ev.sessionId).emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, session));
      }
      else {

        session.changeTurn();

        timers.startTimer(session.sessionId, (e) => {
          io.to(session.sessionId).emit(SocketEvents.TIMER_UPDATED, new SocketResponse(200, e));
        }, (e) => {
          io.to(session.sessionId).emit(SocketEvents.TIMER_FINISHED, new SocketResponse(200, e));
        });

        storage.set(session);

        io.to(ev.sessionId).emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, session));
        io.to(session.sessionId).emit(SocketEvents.GAME_EVENT, new SocketResponse(200, {
          eventName: 'season',
          data: {
            session: session
          }
        }));
      }
    }
  }
  catch(err) {
    console.error(err);
    socket.emit(SocketEvents.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;