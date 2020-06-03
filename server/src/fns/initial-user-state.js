/**
 *
 * @param {String} userId
 */
const fn = function(userId) {

  if (!userId) {
    throw new Error('Must provide userId');
  }

  return {
    id: userId,
    state: {
      connected: true,
      resigned: false
    }
  }
}

module.exports = fn;