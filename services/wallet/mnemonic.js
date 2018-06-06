let bip39 = require('bip39')

module.exports = {
  generateMnemonic: () => bip39.generateMnemonic(),
  validateMnemonic: mnemonic => bip39.validateMnemonic(mnemonic),
  mnemonicToSeed: mnemonic => bip39.mnemonicToSeed(mnemonic),
  mnemonicToSeedHex: mnemonic => bip39.mnemonicToSeedHex(mnemonic)
}
