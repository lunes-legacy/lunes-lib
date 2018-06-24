const LunesJsApi = require('lunes-js-api')
// const MnemonicService = require('../mnemonic')
// const errorPattern = require('../../errorPattern')

/**
 * Create a lunes seed from mnemonic
 * @param {*} mnemonic - the mnemonic words
 * @param {*} network - Lunes Network
 */
const mnemonicToSeed = (mnemonic, network) => {
  // if (!MnemonicService.validateMnemonic(mnemonic)) {
  //   throw errorPattern('Invalid mnemonic', 0, 'INVALID_MNEMONIC')
  // }
  const Lunes = LunesJsApi.create(network.APICONFIG)
  const seed = Lunes.Seed.fromExistingPhrase(mnemonic)
  return seed
}

/**
 * Create a lunes seed from the phrase
 * @param {*} mnemonic - the mnemonic words
 * @param {*} network - Lunes Network
 */
const newAddress = (mnemonic, network) => {
  const seed = mnemonicToSeed(mnemonic, network)
  if (seed !== 'Invalid') {
    return seed.address
  }

  return seed
}

module.exports = {
  newAddress,
  mnemonicToSeed
}
