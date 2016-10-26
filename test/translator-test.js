/*
 * translator-test.js
 * @license   MIT
 */

import Translator from '../src/translator';
import { expect } from 'chai';

describe('machine-translator', () => {

  var t = new Translator();
  it('should throw an error if not given a native and foreign text', function () {
    expect(t.train).to.throw('Native and Foreign Texts are both required!')
  });

  it('should initialize model correctly', function () {
    t.train('./tests/data/shortEN.txt', './tests/data/shortDE.txt');

    expect(t.nativeLines).to.include('the dog');
    expect(t.nativeWords).not.to.have.length(0);

    expect(t.foreignLines).to.include('der Hund');
    expect(t.foreignWords).not.to.have.length(0);

    expect(t.sentencePairs).not.to.have.length(0)
  })

  it('should calculate transmissions', function () {
    var t = new Translator();
    expect(t.transmissions).to.be.empty;
    t.train('./tests/data/shortEN.txt', './tests/data/shortDE.txt');

    expect(t.transmissions.the).to.contain({
      der: 0.2, Hund: 0.2, die: 0.2, Katze: 0.2, Bus: 0.2
    });
    expect(t.transmissions.cat).to.contain({ die: 0.5, Katze: 0.5 });
    expect(t.transmissions.dog).to.contain({ der: 0.5, Hund: 0.5 });
    expect(t.transmissions.bus).to.contain({ der: 0.5, Bus: 0.5 });
  });

  it('should iterate the max likelihood', function () {
    var t = new Translator();
    expect(t.countef).to.be.empty;
    expect(t.totalf).to.be.empty;
    t.train('./tests/data/shortEN.txt', './tests/data/shortDE.txt');
    expect(t.transmissions).not.to.be.empty;
  });

  it('should return probable translations', function () {
    var t = new Translator();
    t.train('./tests/data/shortEN.txt', './tests/data/shortDE.txt');
    var probableMatches = t.translate('cat');
    console.log(probableMatches);
    expect(probableMatches['Katze']).to.equal(0.5)
  });

  it('should throw an error if translating a non-matching word', function () {
    var t = new Translator();
    t.train('./test/data/shortEN.txt', './test/data/shortDE.txt');

    expect(function () {
      t.translate('cool')
    }).to.throw('No match found!')
  });
});
