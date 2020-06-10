(async () => {
  const app = require('express')();
  const http = require('http').Server(app);
  const io = require('socket.io')(http);

  // Events
  const onGet = require('./events/on-get');
  const onHost = require('./events/on-host');
  const onJoin = require('./events/on-join');
  const onSessionUpdate = require('./events/on-session-update');
  const onQuit = require('./events/on-quit');
  const onReady = require('./events/on-ready');
  const onStats = require('./events/on-stats');

  // Classes
  const SessionsStorage = require('./classes/sessions-storage');
  const Stats = require('./classes/stats');
  const SocketEvents = require('./classes/socket-events');
  const events = new SocketEvents();

  // Global instances
  const sessionsStorage = new SessionsStorage();
  const stats = new Stats();

  // Initiate storage
  sessionsStorage.init();

  // TODO: Fix spamming connections bug
  // perhaps by sending cached id at connection
  io.on('connect', socket => {

    stats.connected();

    socket.on('stats', () => onStats(io, stats));
    socket.on('pre_update', ev => onSessionUpdate(io, ev, sessionsStorage, events.PRE_UPDATE_SUCCESS));
    socket.on('update', ev => onSessionUpdate(io, ev, sessionsStorage, events.UPDATE_SUCCESS));
    socket.on('get', ev => onGet(socket, ev, sessionsStorage));
    socket.on('host', ev => onHost(socket, ev, sessionsStorage));
    socket.on('join', ev => onJoin(io, ev, sessionsStorage));
    socket.on('quit', ev => onQuit(io, ev, sessionsStorage));
    socket.on('ready', ev => onReady(io, ev, sessionsStorage));

    socket.on('disconnect', () => {
      stats.disconnected();
      io.emit('stats_success');
    });
  });

  http.listen(4201);
})();