/**
 *
 * @param {*} session
 * @param {*} faction
 */
const fn = function(session, clientId, faction) {

  const _session = session;

  _session.state.players[clientId].faction = faction;

  return _session;
}

module.exports = fn;