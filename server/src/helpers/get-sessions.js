
const storage = require('node-persist');
const setSessions = require('./set-sessions');

const fn = async function() {

  let sessions = await storage.getItem('sessions');

  if (!sessions) {
    await setSessions({});
    sessions = await storage.getItem('sessions');
  }

  return sessions;
}

module.exports = fn;