const fs = require('fs');

// read file
const xmlFile = fs.readFileSync('../src/assets/SVG/map-europe.svg', 'utf8');

// const pointsAsArray = xmlFile.split(/points=\"[\d.\d ]+\"/g)
  // .map((pointsAttr) => {
  //   return pointsAttr.split('points="')[0];
  // });

var regexp = new RegExp(/points=\"[\d.\d ]+/g);
var match;
var matches = [];

while ((match = regexp.exec(xmlFile)) != null) {
  matches.push(match[0]);
}

matches = matches.map((match) => {
  return match.split('points="')[1];
});

fs.writeFile('../server/src/map-points/test.js', `module.exports = ${JSON.stringify(matches)};`, () => {
  console.log('success');
});