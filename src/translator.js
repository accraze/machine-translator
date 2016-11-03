/**
 * translator.js
 *
 * @license MIT
 *
 * Translator module. Uses statistical machine translation to
 * translate between two different languages. Loosely based on
 * the IMB model 1 algorithm.
 */

import reader from 'text2token';
import _ from 'underscore';

export default class Translator {

  constructor() {
    this.foreignWords   = [];
    this.foreignLines   = [];
    this.nativeWords    = [];
    this.nativeLines    = [];
    this.devWords       = [];
    this.sentencePairs  = [];

    this.probs          = {};
    this.transmissions  = {}; // this is t(elf)
    this.countef        = {};
    this.totalf         = {};
    this.totals         = {};
  }

  train(nativeText, foreignText) {

    if (nativeText === undefined || foreignText === undefined) {
      throw new Error('Native and Foreign Texts are both required!');
    }

    const convertedData = reader.text2token(nativeText);
    this.nativeLines = convertedData.lines;
    this.nativeWords = convertedData.tokens;

    const convertedForeignData = reader.text2token(foreignText);
    this.foreignLines = convertedForeignData.lines;
    this.foreignWords = convertedForeignData.tokens;

    this.sentencePairs = [];

    for (let index = 0; index < this.nativeLines.length; index++) {
      this.sentencePairs.push([
        this.nativeLines[index],
        this.foreignLines[index]
      ]);
    }

    this._initTransmissions();
    this._iterateEM(10);
  }

  _initTransmissions() {
    const probs         = {},
          transmissions = {};

    for (let wordIndex = 0; wordIndex < this.nativeWords.length; wordIndex++) {
      const word = this.nativeWords[wordIndex];
      const word_poss = [];

      // if word is in sentence then...
      for (let lineIndex = 0; lineIndex < this.nativeLines.length; lineIndex++) {
        const sentence = this.nativeLines[lineIndex];
        if (sentence.indexOf(word) > -1) {
          const matching = this.foreignLines[this.nativeLines.indexOf(sentence)];
          const matches = matching.split(' ');
          matches.forEach(match => word_poss.push(match));
        }
      }

      /** Remove duplicates. */
      /** Add probable matches. */
      probs[word] = _.unique(word_poss);
    }

    this.probs = probs;

    for (let wordIndex = 0; wordIndex < this.nativeWords.length; wordIndex++) {
      const word = this.nativeWords[wordIndex];
      const word_probs = this.probs[word];

      const uniform_prob = 1.0 / word_probs.length;

      const prob_set = {};

      for (let probIndex = 0; probIndex < word_probs.length; probIndex++) {
        const w = word_probs[probIndex];
        prob_set[w] = uniform_prob;
      }

      transmissions[word] = prob_set;
    }

    this.transmissions = transmissions;
  }

  _iterateEM(count) {

    for (let index = 0; index < count; index++) {
      const totalf  = {},
            countef = {};

      for (let wordIndex = 0; wordIndex < this.nativeWords.length; wordIndex++) {
        const word = this.nativeWords[wordIndex];

        if (!this.probs.word) {
          continue;
        }
        /* istanbul ignore next */
        const word_probs = this.probs[word];
        /* istanbul ignore next */
        const prob_set = {};
        /* istanbul ignore next */
        for (let probIndex = 0; probIndex < word_probs.length; probIndex++) {
          const w = word_probs[probIndex];
          prob_set[w] = 0;
        }
        /* istanbul ignore next */
        countef[word] = count;
        /* istanbul ignore next */
        totalf[word] = 0;
      }

      this.countef = countef;
      this.totalf = totalf;

      const self = this;

      /** Iterate over each sentence pair. */
      this.sentencePairs.forEach(sentence => {

        const nativeTokens = sentence[0].split('');
        const foreignTokens = sentence[1].split('');

        for (let foreign = 0; foreign < foreignTokens.length; foreign++) {
          this.totals[foreign] = 0;
          for (let native = 0; native < nativeTokens.length; native++) {
            if (!this.transmissions.n) {
              continue;
            }
            /* istanbul ignore next */
            if (!this.transmissions.n.f) {
              continue;
            }
            /* istanbul ignore next */
            this.countef[native][foreign] +=
              this.transmissions[native][foreign] / this.totals[foreign];
            /* istanbul ignore next */
            this.totalf[native] +=
              this.transmissions[native][foreign] / this.totals[foreign];
          }
        }

        for (let native = 0; native < nativeTokens.length; native++) {
          if (!this.probs.n) {
            continue;
          }
          /* istanbul ignore next */
          const n_prob = self.probs[native];
          /* istanbul ignore next */
          for (let foreign = 0; foreign < n_prob.length; native++) {
            this.transmissions[native][foreign] = this.countef[native][foreign] / this.totalf[native];
          }
        }
      });
    }
  }

  translate(nativeWord) {
    if (!this.transmissions[nativeWord] || nativeWord === undefined) {
      throw new Error('No match found!');
    }
    return this.transmissions[nativeWord]
  }

}
