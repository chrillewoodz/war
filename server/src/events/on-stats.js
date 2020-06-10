const Stats = require('../classes/stats');
const SocketError = require('../classes/socket-error');
const SocketResponse = require('../classes/socket-response');
const SocketEvents = require('../classes/socket-events');
const events = new SocketEvents();

/**
 *
 * @param {SocketIO.Socket} socket
 * @param {Stats} statsInstance
 */
const fn = function(socket, statsInstance) {

  try {
    const stats = statsInstance.get();
    socket.emit(events.STATS_SUCCESS, new SocketResponse(200, stats));
  }
  catch (err) {
    console.log(err);
    socket.emit(events.INTERNAL_ERROR, new SocketError(err.message));
  }
}

module.exports = fn;