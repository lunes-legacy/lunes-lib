/**
 * Create a lunes seed from mnemonic
 * @param {*} mnemonic - the mnemonic words
 * @param {*} network - Lunes Network
 */
const mnemonicToSeed = async (mnemonic, network) => {
  const axios = require('axios')
  const endpoint = `${require('../../../constants/api')}/coins/mobile/wallet`

  const data = {
    mnemonic: mnemonic,
    testnet: network.testnet,
    method: 'mnemonicToSeed'
  }

  const result = await axios.post(endpoint, data)
  return result.data
}

/**
 * Create a lunes seed from the phrase
 * @param {*} mnemonic - the mnemonic words
 * @param {*} network - Lunes Network
 */
const newAddress = async (mnemonic, network) => {
  const axios = require('axios')
  const endpoint = `${require('../../../constants/api')}/coins/mobile/wallet`

  const data = {
    mnemonic: mnemonic,
    testnet: network.testnet,
    method: 'newAddress'
  }

  const result = await axios.post(endpoint, data)
  return result.data
}

module.exports = {
  newAddress,
  mnemonicToSeed
}
