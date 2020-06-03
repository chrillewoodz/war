const { v4 } = require('uuid');
const initialUserState = require('./initial-user-state');

/**
 *
 * @param {String} clientId
 * @param {{private: Boolean, maxPlayers: Number}} settings
 */
const fn = function(clientId, settings) {

  if (!clientId || !settings) {
    throw new Error('[createSession] Insufficient parameters provided');
  }

  return {
    sessionId: v4(),
    started: false,
    paused: false,
    settings,
    state: {
      players: {
        [clientId]: initialUserState(clientId)
      },
      logs: []
    }
  };
}

module.exports = fn;