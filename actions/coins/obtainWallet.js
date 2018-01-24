const Mnemonic = require('../../services/crypto/mnemonic')

module.exports = (encryptedWallet, password) => {
  try {
    const decryptedWallet = Mnemonic.decryptMnemonic(encryptedWallet, password)
    if (!Mnemonic.validateMnemonic(decryptedWallet)) {
      throw new Error('Error validating generated mnemonic words.')
    }
    return decryptedWallet
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
