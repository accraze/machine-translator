function Translator(data) {
  this.foreignWords = []
  this.foreignDict = []
  this.nativeWords = []
  this.nativeDict = []
  this.devWords = []
  this.sentencePairs = []

  this.probs = {}
  this.transmissions = {}  // this is t(e|f)
  this.countef = {}  // this countef
  this.totalf = {}
  this.totals = {}
  this.data = data  // this holds all the sysargs

  this.en_dict, this.en_words = this.convertArgsToTokens(this.data[1])
  this.de_dict, this.de_words = this.convertArgsToTokens(this.data[2])

  this.dev_in = open(this.data[3], 'r')
  this.dev_lines = this.dev_in.readlines()
  this.dev_in.close()

  // for index in range(len(this.en_dict)):
  //     pair = (this.en_dict[index], this.de_dict[index])
  //     this.sent_pairs.append(pair)

}


module.exports = Translator;

function train(native, foreign) {
  return 'We are training!';
}

function translate(word) {
  return 'We are translating' + word;
}