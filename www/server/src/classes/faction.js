class Faction {

  constructor(name, colorRGB, colorRGBA) {
    this.name = name;
    this.colorRGB = colorRGB;
    this.colorRGBA = colorRGBA;
  }

  toJSON() {

    return {
      name: this.name,
      colorRGB: this.colorRGB,
      colorRGBA: this.colorRGBA
    };
  }
}

module.exports = Faction;