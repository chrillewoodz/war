(async () => {
  const app = require('express')();
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const storage = require('node-persist');

  // events
  const onGet = require('./events/on-get');
  const onHost = require('./events/on-host');
  const onJoin = require('./events/on-join');
  const onSessionUpdate = require('./events/on-session-update');

  // fns

  // Helpers
  const getSessions = require('./helpers/get-sessions');

  // Initiate data persistance
  await storage.init();

  let sessions;
  let active = 0;

  io.on('connect', socket => {

    active++;

    socket.on('stats', () => {
      io.emit('stats', {
        active
      });
    });

    socket.on('get', async ev => onGet(socket, ev, await getSessions()));
    socket.on('host', async ev => onHost(socket, ev, await getSessions()));
    socket.on('join', async ev => onJoin(io, ev, await getSessions()));
    socket.on('session_update', async ev => onSessionUpdate(io, ev, await getSessions()));

    socket.on('disconnect', socket => {
      active--;
      io.emit('activeUsers', active);
    });
  });

  http.listen(4201);
})();