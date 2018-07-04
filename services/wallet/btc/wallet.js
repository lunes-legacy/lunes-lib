const ValidateAddress = require('../validateAddress')
const errorPattern = require('../../errorPattern')

const axios = require('axios')
const endpoint = `${require('../../../constants/api')}/coins/mobile/btc/wallet`

/**
 * Derive a bitcoin address from a mnemonic
 * @param {*} mnemonic - the mnemonic words
 * @param {*} network - Bitcoin Network
 */
const newAddress = async (mnemonic, network) => {
  const data = {
    mnemonic: mnemonic,
    testnet: network.testnet,
    method: 'newAddress'
  }

  const result = await axios.post(endpoint, data)

  if (!ValidateAddress(result.data, network.coinSymbol, network.testnet)) {
    throw errorPattern(
      'Invalid ' + network.coinName + ' Address',
      0,
      'ADDRESS_INVALID',
      'The address ' +
        result.data +
        ' is not a valid ' +
        network.coinName +
        ' address.'
    )
  }
  return result.data
}

/**
 * Create a keyPair from the mnemonic words
 * @param {*} mnemonic - the mnemonic words
 * @param {*} network - Bitcoin Network
 * TODO: add derivation index from DB
 */
const mnemonicToKeyPair = async (mnemonic, network) => {
  const data = {
    mnemonic: mnemonic,
    testnet: network.testnet,
    method: 'mnemonicToKeyPair'
  }

  const result = await axios.post(endpoint, data)
  return result.data
}

module.exports = {
  newAddress,
  mnemonicToKeyPair
}
