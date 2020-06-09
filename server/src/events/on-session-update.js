const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const Session = require('../classes/session');
const SessionsStorage = require('../classes/sessions-storage');
const SocketEvents = require('../classes/socket-events');
const events = new SocketEvents();

/**
 * Updates a session with new state and returns a new session object
 * @param {*} session
 * @param {{
 *   sessionId: String
 *   newState: *
 * }} ev
 * @param {SessionsStorage} storage
 */
const fn = async function(socket, ev, storage, event) {
  console.log(ev);
  try {

    /**
     * @type {Session}
     */
    const session = await storage.getById(ev.sessionId);

    if (!session) {
      throw new Error('No game session with that id');
    }
    else {

      // Replace current session state with the new state
      session.state = ev.newState;

      // Re-set the session in the immutable sessions object
      await storage.set(session);

      socket.emit(event, new SocketResponse(200, session));
    }
  }
  catch(err) {
    console.error(err);
    socket.emit(events.INTERNAL_ERROR, new SocketError(500, err.message));
  }
}

module.exports = fn;