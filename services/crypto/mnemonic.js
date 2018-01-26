let SimpleCryptoJS = require('simple-crypto-js').default
let bip39 = require('bip39')

const encryptMnemonic = (mnemonic, passphrase) => {
  const simpleCrypto = new SimpleCryptoJS(passphrase)
  const cipherText = simpleCrypto.encrypt(mnemonic)
  return cipherText
}

const decryptMnemonic = (cipherText, passphrase) => {
  const simpleCrypto = new SimpleCryptoJS(passphrase)
  const decipherText = simpleCrypto.decrypt(cipherText)
  return decipherText
}

module.exports = {
  encryptMnemonic,
  decryptMnemonic,
  generateMnemonic: () => bip39.generateMnemonic(),
  validateMnemonic: mnemonic => bip39.validateMnemonic(mnemonic),
  mnemonicToSeedHex: mnemonic => bip39.mnemonicToSeedHex(mnemonic)
}
