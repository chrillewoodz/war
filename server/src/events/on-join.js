const Faction = require('../classes/faction');
const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const AppStorage = require('../classes/app-storage');
const Session = require('../classes/session');
const SocketEvents = require('../classes/socket-events');
const { getUnusedFaction } = require('../factions');

/**
 *
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param {{
 *   extras: *
 *   clientId: String
 * }} ev
 * @param {AppStorage} storage
 */
const fn = async function(io, socket, ev, storage) {

  try {

    // It will only try to find a session by its sessionId if
    // ev.sessionId is defined
    /**
     * @type {Session}
     */
    const session = await storage.find(ev.sessionId);

    if (session) {
      console.log(session);
      const { name, colorRGB, colorRGBA } = getUnusedFaction(session);
      const faction = new Faction(name, colorRGB, colorRGBA);
      const extras = ev.extras ? { ...ev.extras, faction } : { faction };
      session.addPlayer(ev.clientId, extras);

      await storage.set(session);

      socket.join(session.sessionId, () => {
        io.to(session.sessionId).emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, session));
      });
    }
    else {
      throw new Error('No active game session, please create your own');
    }
  }
  catch (err) {
    console.error(err);
    socket.emit(SocketEvents.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;