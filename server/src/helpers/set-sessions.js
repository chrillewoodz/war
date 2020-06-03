const storage = require('node-persist');

/**
 *
 * @param {Array} sessions
 */
const fn = async function(sessions) {
  return await storage.setItem('sessions', sessions);
}

module.exports = fn;