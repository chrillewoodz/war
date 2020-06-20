const Stats = require('../classes/stats');
const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const SocketEvents = require('../classes/socket-events');
const AppStorage = require('../classes/app-storage');

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {Stats} statsInstance
 * @param {AppStorage} storage
 */
const fn = async function(socket, statsInstance, storage) {

  try {
    const stats = await statsInstance.get(socket, storage);
    socket.emit(SocketEvents.STATS_SUCCESS, new SocketResponse(200, stats));
  }
  catch (err) {
    console.log(err);
    socket.emit(SocketEvents.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;