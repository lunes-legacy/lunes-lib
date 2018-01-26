let SimpleCryptoJS = require('react-native-simple-encryption')
let bip39 = require('react-native-bip39')

const encryptMnemonic = (mnemonic, passphrase) => {
  // const simpleCrypto = new SimpleCryptoJS(passphrase)
  return SimpleCryptoJS.encrypt(passphrase, mnemonic)
}

const decryptMnemonic = (cipherText, passphrase) => {
  // const simpleCrypto = new SimpleCryptoJS(passphrase)
  return SimpleCryptoJS.decrypt(passphrase, cipherText)
}

module.exports = {
  encryptMnemonic,
  decryptMnemonic,
  generateMnemonic: () => bip39.generateMnemonic(),
  validateMnemonic: mnemonic => bip39.validateMnemonic(mnemonic),
  mnemonictoSeedHex: mnemonic => bip39.mnemonicToSeedHex(mnemonic)
}
