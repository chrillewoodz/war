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

      if (ev.resigned) {
        session.playerResigned(ev.clientId);
      }
      else {
        session.playerQuit(ev.clientId);
      }

      const activePlayersLeft = session.activePlayersLeft();

      if (session.state.started && activePlayersLeft.length === 1) {
        session.end();
        session.state.winner = activePlayersLeft[0];
        storage.set(session);
      }
      else if (activePlayersLeft.length === 0) {
        storage.remove(session.sessionId);
      }
      else if (session.statestarted && session.state.currentTurn.clientId === ev.clientId) {

        const winner = session.checkWinCondition();

        if (winner) {
          session.state.winner = winner;
          session.end();
        }
        else {
          session.changeTurn();
        }

        storage.set(session);
      }

      io.to(session.sessionId).emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, session));

      // If you quit, then you should leave
      if (!ev.resigned) {
        socket.leave(session.sessionId);
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