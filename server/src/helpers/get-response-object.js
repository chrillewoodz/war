/**
 *
 * @param {Number} status
 * @param {*} res
 * @param {String} err
 */
const fn = function(status, res, err) {

  return {
    status,
    res,
    err
  }
}

module.exports = fn;