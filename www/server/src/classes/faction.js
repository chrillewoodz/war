class Faction {

  constructor(name, flag, colorRGB, colorRGBA) {
    this.name = name;
    this.flag = flag;
    this.colorRGB = colorRGB;
    this.colorRGBA = colorRGBA;
  }

  toJSON() {

    return {
      name: this.name,
      flag: this.flag,
      colorRGB: this.colorRGB,
      colorRGBA: this.colorRGBA
    };
  }
}

module.exports = Faction;