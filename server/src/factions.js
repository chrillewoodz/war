const Sweden = {
  name: 'Sweden',
  colorRGB: 'rgb(242, 248, 81)',
  colorRGBA: 'rgba(242, 248, 81, 0.6)'
};

const China = {
  name: 'China',
  colorRGB: 'rgb(40, 110, 53)',
  colorRGBA: 'rgba(40, 110, 53, 0.6)'
};

const Somalia = {
  name: 'Somalia',
  colorRGB: 'rgb(219, 132, 10)',
  colorRGBA: 'rgba(219, 132, 10, 0.6)'
};

const Germany = {
  name: 'Germany',
  colorRGB: 'rgb(226, 47, 142)',
  colorRGBA: 'rgba(226, 47, 142, 0.6)'
};

const asArray = [Sweden, China, Somalia, Germany];

function getUnusedFaction(session) {

  // Get factions that are already used by other players
  const factionsUsed = Object.keys(session.state.players)
    .map((clientId) => session.state.players[clientId].extras.faction.name);

  // Filter out factions already used
  const _asArray = [...asArray]
    .filter((f) => factionsUsed.indexOf(f.name) === -1);

  // Return a random faction based on the factions who are not used
  return _asArray[Math.floor(Math.random() * (asArray.length - 1))];
}

module.exports = {
  Sweden,
  China,
  Somalia,
  Germany,
  asArray,
  getUnusedFaction
}