var reader = require('text2token');

Array.prototype.contains = function(v) {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === v) return true;
    }
    return false;
};

Array.prototype.unique = function() {
    var arr = [];
    for(var i = 0; i < this.length; i++) {
        if(!arr.contains(this[i])) {
            arr.push(this[i]);
        }
    }
    return arr; 
}

function Translator(nativeText, foreignText) {
  if ( nativeText == undefined || foreignText == undefined ) {
      throw new Error('Native and Foreign Texts are both required!');
  }

  this.foreignWords = []
  this.foreignLines = []
  this.nativeWords = []
  this.nativeLines = []
  this.devWords = []
  this.sentencePairs = []

  this.probs = {}
  this.transmissions = {}  // this is t(e|f)
  this.countef = {}  // this countef
  this.totalf = {}
  this.totals = {}

  var convertedData = reader.text2token(nativeText);
  this.nativeLines = convertedData.lines;
  this.nativeWords = convertedData.tokens;

  var convertedForeignData = reader.text2token(foreignText);
  this.foreignLines = convertedForeignData.lines;
  this.foreignWords = convertedForeignData.tokens;
  
  for(var i = 0; i < this.nativeLines.length; i++) {
    var pair = [ this.nativeLines[i], this.foreignLines[i] ];
    this.sentencePairs.push(pair)
  }
}


module.exports = Translator;