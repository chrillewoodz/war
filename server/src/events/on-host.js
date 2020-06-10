const Faction = require('../classes/faction');
const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const Session = require('../classes/session');
const SessionsStorage = require('../classes/sessions-storage');
const SocketEvents = require('../classes/socket-events');
const { asArray } = require('../factions');
const events = new SocketEvents();

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {{
 *   extras: *
 *   clientId: String
 * }} ev
 * @param {SessionsStorage} storage
 */
const fn = async function(socket, ev, storage) {

  try {

    const { name, colorRGB, colorRGBA } = asArray[Math.floor(Math.random() * (asArray.length - 1))];
    const faction = new Faction(name, colorRGB, colorRGBA);
    const extras = ev.extras ? { ...ev.extras, faction } : { faction };
    const session = new Session({ settings: ev.settings });
          session.addPlayer(ev.clientId, extras);

    await storage.set(session);

    socket.emit(events.HOST_SUCCESS, new SocketResponse(200, session));
  }
  catch (err) {
    console.error(err);
    socket.emit(events.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;