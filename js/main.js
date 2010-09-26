function RGB(red, green, blue) {

  this.red = red;
  this.green = green;
  this.blue = blue;
  
  this.distanceFrom = function(other) {
    return Math.sqrt(
      Math.pow(this.red - other.red, 2) +
      Math.pow(this.green - other.green, 2) +
      Math.pow(this.blue - other.blue, 2)
    );
  };

  this.toString = function() {
    return sprintf('#%02x%02x%02x', this.red, this.green, this.blue);
  };

};


// Static method to create RGB from a hex string.
RGB.fromHex = function(hex_str) {
  var hex_str_strip = hex_str.replace(/^\s+|\s+$|#/g, '');
  red = parseInt(hex_str_strip[0] + hex_str_strip[1], 16);
  green = parseInt(hex_str_strip[2] + hex_str_strip[3], 16);
  blue = parseInt(hex_str_strip[4] + hex_str_strip[5], 16);
  return new RGB(red, green, blue)
};


function Color(name, rgb) {

  this.name = name;
  this.rgb = rgb;

  this.toString = function() {
    return sprintf('("%s", "%s")', this.name, this.rgb.toString());
  };

};


function ColorDatabase(name, source) {

  this.name = name;
  this.source = source;

  this.colors = new Array();

  this.addColor = function(color) {
    this.colors.push(color);
  };

  this.findNearest = function(rgb) {
    var results = new Array();
    for (var i in this.colors) {
      color = this.colors[i];
      results.push([rgb.distanceFrom(color.rgb), color]);
    }
    results.sort(function(a, b) {
      if (a[0] == b[0]) {
        if (a[1].name < b[1].name) {
          return -1;
        };
        if (a[1].name > b[1].name) {
          return 1;
        };
      };
      return a[0] - b[0];
    });
    return results;
  };

};


// Static method to create a database from a dictionary of RGB values.
ColorDatabase.fromRGBDict = function(name, source, colorDict) {
  var database = new ColorDatabase(name, source);
  for (var name in colorDict) {
    rgb_array = colorDict[name];
    color = new Color(name, new RGB(rgb_array[0], rgb_array[1], rgb_array[2]));
    database.addColor(color);
  }
  return database;
};


// Static method to create a database from a dictionary of hex strings.
ColorDatabase.fromHexDict = function(name, source, colorDict) {
  var database = new ColorDatabase(name, source);
  for (var name in colorDict) {
    hex_str = colorDict[name];
    color = new Color(name, RGB.fromHex(hex_str));
    database.addColor(color);
  }
  return database;
};
