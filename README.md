[![travis build](https://img.shields.io/travis/accraze/machine-translator.svg)](https://travis-ci.org/accraze/machine-translator)
[![Codecov](https://img.shields.io/codecov/c/github/accraze/machine-translator.svg)](https://codecov.io/github/accraze/machine-translator)
[![version](https://img.shields.io/npm/v/machine-translator.svg)](https://www.npmjs.com/package/machine-translator)
[![license](https://img.shields.io/npm/l/machine-translator.svg)](https://www.npmjs.com/package/machine-translator)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
# machine-translator
is a nodejs module that uses statistical machine translation to translate between two different languages. the module is loosely based off of the IBM model 1 algorithm and has been tested using english.

## Install:
`$ npm install machine-translator`

## Usage:
This module requires:

1. A native corpus of text (i.e. english text file)
2. A matching foreign corpus of text (i.e. german text file)

### Example
```javascript
var Translator = require('machine-translator');

var t = new Translator();

t.train('./tests/data/shortEN.txt', './tests/data/shortDE.txt');

t.translate('cat'); // { die: 0.5, Katze: 0.5 }
t.translate('the'); // { der: 0.2, Hund: 0.2, die: 0.2, Katze: 0.2, Bus: 0.2 }
t.translate('car'); // Error: No matches found!
```

### NPM Commands

We have some NPM commands to help testing/linting:

```
npm run test:watch

npm run lint

npm run lint:watch
# lint in watch mode

npm run compile
# important!! needs to be run before release, note how main script points to dist instead of src
```


## License:
[MIT](https://github.com/accraze/machine-translator/blob/master/LICENSE) License 2015-2018 © Andy Craze & Contributors
