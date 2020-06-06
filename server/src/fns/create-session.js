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
    settings,
    state: {
      started: false,
      paused: false,
      players: {
        [clientId]: initialUserState(clientId)
      },
      logs: [],
      areas: null,
      areasReady: false
    }
  };
}

module.exports = fn;