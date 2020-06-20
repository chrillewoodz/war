const Faction = require('../classes/faction');
const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const Session = require('../classes/session');
const AppStorage = require('../classes/app-storage');
const SocketEvents = require('../classes/socket-events');
const { asArray } = require('../factions');

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

    const { name, colorRGB, colorRGBA } = asArray[Math.floor(Math.random() * (asArray.length - 1))];
    const faction = new Faction(name, colorRGB, colorRGBA);
    const extras = ev.extras ? { ...ev.extras, faction } : { faction };
    const session = new Session({ settings: ev.settings });
          session.addPlayer(ev.clientId, extras);

    await storage.set(session);

    socket.join(session.sessionId, (err) => {
      console.log(err);
      io.to(session.sessionId).emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, session));
    });
  }
  catch (err) {
    console.error(err);
    socket.emit(SocketEvents.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;