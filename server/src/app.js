(async () => {
  const app = require('express')();
  const http = require('http').Server(app);
  const io = require('socket.io')(http);
  const schedule = require('node-schedule');
  const differenceInMinutes = require('date-fns/differenceInMinutes');

  // Events
  const onGet = require('./events/on-get');
  const onHost = require('./events/on-host');
  const onJoin = require('./events/on-join');
  const onSessionUpdate = require('./events/on-session-update');
  const onQuit = require('./events/on-quit');
  const onReady = require('./events/on-ready');
  const onStats = require('./events/on-stats');
  const onIsActive = require('./events/on-is-active');

  // Classes
  const Session = require('./classes/session');
  const SessionsStorage = require('./classes/sessions-storage');
  const Stats = require('./classes/stats');
  const SocketEvents = require('./classes/socket-events');
  const SocketResponse = require('./classes/socket-response');

  // Global instances
  const storage = new SessionsStorage();
  const stats = new Stats();

  // Initiate storage
  try {
    await storage.init();
  }
  catch (e) {
    console.error(e);
  }

  // Cron jobs, only used for cleanup of dead sessions
  // This one runs every 2.5 minutes
  schedule.scheduleJob('*/30 * * * * *', async () => {

    console.log('Removing dead game sessions...');

    const sessions = await storage.getAll();

    Object.keys(sessions)
      .map((sessionId) => sessions[sessionId])
      .map((session) => new Session(session))
      .forEach(async (session) => {

        const lastUpdatedAt = new Date(session.lastUpdatedAt);
        const now = Date.now();
        const diff = differenceInMinutes(now, lastUpdatedAt);
        const isStarted = session.state.started;
        const isPaused = session.state.paused;
        const isEnded = session.state.paused;
        const activePlayersLeft = session.activePlayersLeft();

        // Has started and was updated in last 2 minutes
        if (isStarted && diff < 2 && activePlayersLeft >= 2) {
          console.log(session.sessionId, ` was not removed. It was active in the last 2 mins. Diff: ${diff}`);
          return;
        }
        // Is paused and wasn't updated in the last 30min, end game
        else if (isPaused && diff > 30) {
          session.end();
          await storage.set(session);
          console.log(session.sessionId, ' ended due to paused game not resuming within 30min.');
        }
        // Has ended and wasn't updated in the last 2 minutes
        else if (isEnded && diff > 2) {
          await storage.remove(session.sessionId);
          console.log(session.sessionId, ' was removed due to the game already ended and not updated in the last 2 minutes.');
        }
        // If the game was started but there's only one player left
        // end the game and let the client handle whatever comes next.
        else if (session.state.started && !session.state.ended && activePlayersLeft < 2) {
          session.end();
          await storage.set(session);
          console.log(session.sessionId, ' was ended due to fewer than 2 active players in a started game.');
        }
        // Game hasn't started and there's no active players left waiting in the session
        else if (!session.state.started && activePlayersLeft === 0) {
          await storage.remove(session.sessionId);
          console.log(session.sessionId, ' was removed due to inactivity and unstarted game.');
        }
        else {
          console.log(session.sessionId, ` was not removed. Started: ${isStarted} Ended: ${isEnded} Paused: ${isPaused} AP: ${activePlayersLeft} Diff: ${diff}`);
        }

        io.to(session.sessionId).emit(SocketEvents.UPDATE_SUCCESS, new SocketResponse(200, session));
      });
  });

  // TODO: Fix spamming connections bug
  // perhaps by sending cached id at connection
  io.on('connect', socket => {

    socket.on(SocketEvents.STATS, () => onStats(io, stats, storage));
    socket.on(SocketEvents.UPDATE, ev => onSessionUpdate(io, socket, ev, storage));
    socket.on(SocketEvents.GET, ev => onGet(socket, ev, storage));
    socket.on(SocketEvents.HOST, ev => onHost(io, socket, ev, storage));
    socket.on(SocketEvents.JOIN, ev => onJoin(io, socket, ev, storage));
    socket.on(SocketEvents.QUIT, ev => onQuit(io, socket, ev, storage));
    socket.on(SocketEvents.READY, ev => onReady(io, socket, ev, storage));
    socket.on(SocketEvents.IS_ACTIVE, ev => onIsActive(socket, ev, storage));

    socket.on('disconnect', () => {
      io.emit(SocketEvents.STATS_SUCCESS);
    });
  });

  http.listen(4201);
})();