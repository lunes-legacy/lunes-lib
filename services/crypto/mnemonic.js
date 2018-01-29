let CryptoJS = require('crypto-js')

const encryptMnemonic = (mnemonic, passphrase) => {
  const ciphertext = CryptoJS.AES.encrypt(mnemonic, passphrase)
  return ciphertext.toString()
}

const decryptMnemonic = (cipherText, passphrase) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, passphrase)
  const decipherText = bytes.toString(CryptoJS.enc.Utf8)
  return decipherText
}

module.exports = {
  encryptMnemonic,
  decryptMnemonic
}
