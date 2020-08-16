const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const Session = require('../classes/session');
const AppStorage = require('../classes/app-storage');
const SocketEvents = require('../classes/socket-events');
const Timers = require('../classes/timers');

/**
 *
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param {{
 *   sessionId: String
 *   clientId: String
 * }} ev
 * @param {AppStorage} storage
 * @param {Timers} timers
 */
const fn = async function(io, socket, ev, storage, timers) {

  try {

    /**
     * @type {Session}
     */
    const session = await storage.getById(ev.sessionId);

    if (session) {

      if (!session.state.started) {

        session.playerReady(ev.clientId);

        // Callback runs when all players are ready
        session.checkForReadyPlayers(async () => {

          // Start game
          session.start();

          timers.addTimer(ev.sessionId);

          timers.startTimer(ev.sessionId, async (e) => {
            io.to(ev.sessionId).emit(SocketEvents.TIMER_UPDATED, new SocketResponse(200, e));
          }, (e) => {
            io.to(ev.sessionId).emit(SocketEvents.TIMER_FINISHED, new SocketResponse(200, e));
          });
        });

        await storage.set(session);

        io.to(ev.sessionId).emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, session));
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
    socket.emit(SocketEvents.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;