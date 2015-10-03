var expect = require('chai').expect;
var Translator = require('../src/index.js');

describe('machine-translator', function() {
  it('should throw an error if not given a native and foreign text', function () {
    expect(Translator).to.throw('Native and Foreign Texts are both required!');
  });
})