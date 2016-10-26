/*
 * translator.test.js
 * @license   MIT
 */

import Translator     from '../src/translator';
import { expect }     from 'chai';
import { beforeEach } from 'mocha';

describe('machine-translator', () => {

  let translator;

  beforeEach(() => {
    translator = new Translator();
  });

  it('should throw an error if not given a native and foreign text', function () {
    expect(translator.train).to.throw('Native and Foreign Texts are both required!')
  });

  it('should initialize model correctly', function () {
    translator.train('./test/data/shortEN.txt', './test/data/shortDE.txt');

    expect(translator.nativeLines).to.include('the dog');
    expect(translator.nativeWords).not.to.have.length(0);

    expect(translator.foreignLines).to.include('der Hund');
    expect(translator.foreignWords).not.to.have.length(0);

    expect(translator.sentencePairs).not.to.have.length(0)
  });

  it('should calculate transmissions', function () {
    expect(translator.transmissions).to.be.empty;
    translator.train('./test/data/shortEN.txt', './test/data/shortDE.txt');

    expect(translator.transmissions.the).to.contain({
      der: 0.2, Hund: 0.2, die: 0.2, Katze: 0.2, Bus: 0.2
    });
    expect(translator.transmissions.cat).to.contain({ die: 0.5, Katze: 0.5 });
    expect(translator.transmissions.dog).to.contain({ der: 0.5, Hund: 0.5 });
    expect(translator.transmissions.bus).to.contain({ der: 0.5, Bus: 0.5 });
  });

  it('should iterate the max likelihood', function () {
    expect(translator.countef).to.be.empty;
    expect(translator.totalf).to.be.empty;
    translator.train('./test/data/shortEN.txt', './test/data/shortDE.txt');
    expect(translator.transmissions).not.to.be.empty;
  });

  it('should return probable translations', function () {
    translator.train('./test/data/shortEN.txt', './test/data/shortDE.txt');
    const probableMatches = translator.translate('cat');
    console.log(probableMatches);
    expect(probableMatches['Katze']).to.equal(0.5)
  });

  it('should throw an error if translating a non-matching word', function () {
    translator.train('./test/data/shortEN.txt', './test/data/shortDE.txt');

    expect(() => {
      translator.translate('cool')
    }).to.throw('No match found!')
  });
});
