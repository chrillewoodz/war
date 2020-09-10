const Sweden = {
  name: 'Sweden',
  flag: 'flag-sweden.svg',
  colorRGB: 'rgb(19, 91, 199)',
  colorRGBA: 'rgba(19, 91, 199, 0.8)'
};

const China = {
  name: 'China',
  flag: 'flag-china.svg',
  colorRGB: 'rgb(177, 9, 48)',
  colorRGBA: 'rgba(177, 9, 48, 0.8)'
};

const Somalia = {
  name: 'Somalia',
  flag: 'flag-somalia.svg',
  colorRGB: 'rgb(219, 132, 10)',
  colorRGBA: 'rgba(219, 132, 10, 0.8)'
};

const Germany = {
  name: 'Germany',
  flag: 'flag-germany.svg',
  colorRGB: 'rgb(42, 127, 84)',
  colorRGBA: 'rgba(42, 127, 84, 0.8)'
};

const asArray = [Sweden, China, Somalia, Germany];

function getUnusedFaction(session) {

  // Get factions that are already used by other players
  const factionsUsed = Object.keys(session.state.players)
    .map((clientId) => session.state.players[clientId].extras.faction.name);

  // Filter out factions already used
  const _asArray = [...asArray]
    .filter((f) => factionsUsed.indexOf(f.name) === -1);

  const randomIndex = Math.floor(Math.random() * (_asArray.length - 1));

  // Return a random faction based on the factions who are not used
  return _asArray[randomIndex];
}

module.exports = {
  Sweden,
  China,
  Somalia,
  Germany,
  asArray,
  getUnusedFaction
}