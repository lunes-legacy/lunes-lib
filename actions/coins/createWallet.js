let bitcoin = require('react-native-bitcoinjs-lib')
let _ = require('lodash')
const validator = require('../../services/validators/validator')

const Mnemonic = require('../../services/crypto/mnemonic')

module.exports = (password, testnet) => {
  try {
    // 1. generate mnemonic
    const mnemonic = Mnemonic.generateMnemonic()

    // 2. validate mnemonic
    if (!Mnemonic.validateMnemonic(mnemonic)) {
      throw new Error('Error validating generated mnemonic words.')
    }

    // 3. encrypt wallet
    const encryptedWallet = Mnemonic.encryptMnemonic(mnemonic, password)

    // 4. validate encryption
    const decryptedWallet = Mnemonic.decryptMnemonic(encryptedWallet, password)

    if (!_.isEqual(decryptedWallet, mnemonic)) {
      throw new Error('Error validating decrypted wallet.')
    }

    // 5. mnemonic words to seed hex
    const seedHex = Mnemonic.mnemonicToSeedHex(decryptedWallet)

    // check network
    testnet = validator.isTestnet(testnet)
    const network = testnet
      ? bitcoin.networks.testnet
      : bitcoin.networks.bitcoin

    // 6. create a Bitcoinjs HD Wallet
    const hdNode = bitcoin.HDNode.fromSeedHex(seedHex, network)

    // 7. create an address
    const path = 'm/0\'/0/0' // m/0'/0/0
    const keyPair = hdNode.derivePath(path)
    const address = keyPair.getAddress()

    // 8. return encryptedWallet and public address
    return { encryptedWallet, address }
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
