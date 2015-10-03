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


Translator.prototype.train = function() {
  this._initTransmissions();
  // this._iterateEM(10);
  console.log('We are training!');
}

Translator.prototype._initTransmissions = function() {
  console.log('initializing TEF!');

  var probs = {},
      transmissions = {};

  for (var i = 0; i < this.nativeWords.length; i++) {
    var word = this.nativeWords[i];
    var word_poss = [];
    

    // if word is in sentence then...
    for (var j = 0; j < this.nativeLines.length; j++) {
      var sentence = this.nativeLines[j];

      if (sentence.indexOf(word) > -1) {
        var matching = this.foreignLines[this.nativeLines.indexOf(sentence)];
        var matches = matching.split(' ');
        for(var index = 0; index < matches.length; index++) {
          word_poss.push(matches[index])
        }
      }
    }

    // remove duplicates
    word_poss = word_poss.unique();

    // add probable matches
    probs[word] = word_poss;
  }

  this.probs = probs;

  for (var i = 0; i < this.nativeWords.length; i++) {
    var word = this.nativeWords[i];
    var word_probs = this.probs[word];
    

    var uniform_prob = 1.0 / word_probs.length;

    var prob_set = {};

    for (var k = 0; k < word_probs.length; k++) {
      var w = word_probs[k];
      prob_set[w] = uniform_prob;
    }

    transmissions[word] = prob_set
  }
  this.transmissions = transmissions;
}


module.exports = Translator;