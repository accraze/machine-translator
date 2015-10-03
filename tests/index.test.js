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


})