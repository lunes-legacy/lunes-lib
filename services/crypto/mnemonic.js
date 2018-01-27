let CryptoJS = require("crypto-js");
let bip39 = require("react-native-bip39");

const encryptMnemonic = (mnemonic, passphrase) => {
  const ciphertext = CryptoJS.AES.encrypt(mnemonic, passphrase);
  return ciphertext.toString();
};

const decryptMnemonic = (cipherText, passphrase) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
  const decipherText = bytes.toString(CryptoJS.enc.Utf8);
  return decipherText;
};

module.exports = {
  encryptMnemonic,
  decryptMnemonic,
  generateMnemonic: () => bip39.generateMnemonic(),
  validateMnemonic: mnemonic => bip39.validateMnemonic(mnemonic),
  mnemonicToSeedHex: mnemonic => bip39.mnemonicToSeedHex(mnemonic)
};
