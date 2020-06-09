/**
 *
 * @param {String} clientId
 */
const fn = function(clientId) {

  if (!clientId) {
    throw new Error('Must provide clientId');
  }

  return {
    id: clientId,
    state: {
      connected: true,
      resigned: false,
      quit: false,
      ready: false
    }
  }
}

module.exports = fn;