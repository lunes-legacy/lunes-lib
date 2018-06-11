const WavesAPI = require('waves-api')

/**
 * Create a lunes seed from mnemonic
 * @param {*} mnemonic - the mnemonic words
 * @param {*} network - the coin network
 */
const mnemonicToSeed = (mnemonic, network) => {
  if (mnemonic) {
    const Waves = WavesAPI.create(network.APICONFIG)
    const seed = Waves.Seed.fromExistingPhrase(mnemonic)
    return seed
  }

  return 'Invalid'
}

/**
 * Create a lunes seed from the phrase
 * @param {*} phrase - the phrase words
 * @param {*} testnet - if testnet or not
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
