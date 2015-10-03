var expect = require('chai').expect;
var Translator = require('../src/index.js');

describe('machine-translator', function() {
  it('should throw an error if not given a native and foreign text', function () {
    expect(Translator).to.throw('Native and Foreign Texts are both required!');
  });

  it('should initialize model correctly', function () {
    var t = new Translator('./tests/data/shortEN.txt', './tests/data/shortDE.txt')

    expect(t.nativeLines).to.include('the dog');
    expect(t.nativeWords).not.to.have.length(0);

    expect(t.foreignLines).to.include('der Hund');
    expect(t.foreignWords).not.to.have.length(0);

    expect(t.sentencePairs).not.to.have.length(0);
  });

  it('should initialize transmissions', function () {
    var t = new Translator('./tests/data/shortEN.txt', './tests/data/shortDE.txt')
    expect(t.transmissions).to.be.empty;
    t.train()

    expect(t.transmissions.the).to.contain({ der: 0.2, Hund: 0.2, die: 0.2, Katze: 0.2, Bus: 0.2 });
    expect(t.transmissions.cat).to.contain({ die: 0.5, Katze: 0.5 });
    expect(t.transmissions.dog).to.contain({ der: 0.5, Hund: 0.5 });
    expect(t.transmissions.bus).to.contain({ der: 0.5, Bus: 0.5 });

  });
})