const { v4 } = require('uuid');
const initialUserState = require('./initial-user-state');

/**
 *
 * @param {String} userId
 * @param {{private: Boolean, maxPlayers: Number}} settings
 */
const fn = function(userId, settings) {

  if (!userId || !settings) {
    throw new Error('[createSession] Insufficient parameters provided');
  }

  return {
    sessionId: v4(),
    started: false,
    paused: false,
    settings,
    state: {
      players: {
        [userId]: initialUserState(userId)
      }
    }
  };
}

module.exports = fn;