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
  this._iterateEM(10);
}

Translator.prototype._initTransmissions = function() {
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

Translator.prototype._iterateEM = function(count) {
  for (var i = 0; i < count; i++) {
    var totalf = {},
        countef = {};

        for(var j=0; j < this.nativeWords.length; j++) {
          var word = this.nativeWords[j];
          
          if(!this.probs.word)
            continue;
          /* istanbul ignore next */
          var word_probs = this.probs[word]
          /* istanbul ignore next */
          var prob_set = {};
          /* istanbul ignore next */
          for (var k = 0; k < word_probs.length; k++) {
            var w = word_probs[k];
            prob_set[w] = 0;
          }
          /* istanbul ignore next */
          countef[word] = count;
          /* istanbul ignore next */
          totalf[word] = 0;
        }

        this.countef = countef;
        this.totalf = totalf;

        // iterate over each sentence pair
        for(var k = 0; k < this.sentencePairs.length; k++) {
          var sentence = this.sentencePairs[k];
          var nativeTokens = sentence[0].split('');
          var foreignTokens = sentence[1].split('');

          for (var f = 0; f < foreignTokens.length; f++) {
            this.totals[f] = 0;
            for (var n = 0; n < nativeTokens.length; n++) {
              if(!this.transmissions.n)
                continue;
              /* istanbul ignore next */
              if (!this.transmissions.n.f)
                continue;
              /* istanbul ignore next */
              this.countef[n][f] += this.transmissions[n][f]/this.totals[f];
              /* istanbul ignore next */
              this.totalf[n] += this.transmissions[n][f]/this.totals[f];
            }

          }

          for (var n = 0; n < nativeTokens.length; n++) {
            if (!this.probs.n)
              continue;
            /* istanbul ignore next */
            var n_prob = self.probs[n];
            /* istanbul ignore next */
            for (var f = 0; f < n_prob.length; n++) {
              this.transmissions[n][f] = this.countef[n][f] / this.totalf[n]
            }
          }
        }
  }
}

Translator.prototype.translate = function(nativeWord) {
  if (!this.transmissions[nativeWord] || nativeWord === undefined) {
    throw new Error('No match found!');
  }

  return this.transmissions[nativeWord];
}


module.exports = Translator;