/**
 *
 * @param {Number} status
 * @param {*} res
 * @param {String} err
 */
const fn = function(status, res, err, origin) {

  // NOTE: doing just status, res, etc could cause
  // "Cannot convert undefined or null to object" error
  return {
    status: status,
    res: res,
    err: err,
    origin: origin
  }
}

module.exports = fn;