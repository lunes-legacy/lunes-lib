const bitcoinjs = require('bitcoinjs-lib')
require('bitcoinjs-testnets').register(bitcoinjs.networks)
const MnemonicService = require('../mnemonic')

/**
 * Derive a bitcoin address from a mnemonic
 * @param {*} mnemonic - the mnemonic words
 * @param {*} network - Bitcoin Network
 * TODO: segwit or not parameter
 */
const newAddress = (mnemonic, network) => {
  const keyPair = mnemonicToKeyPair(mnemonic, network)
  let redeemScript = bitcoinjs.script.witnessPubKeyHash.output.encode(
    bitcoinjs.crypto.hash160(keyPair.getPublicKeyBuffer())
  )
  let scriptPubKey = bitcoinjs.script.scriptHash.output.encode(
    bitcoinjs.crypto.hash160(redeemScript)
  )
  let address = bitcoinjs.address.fromOutputScript(
    scriptPubKey,
    network.bitcoinjsNetwork
  )
  return address
}

/**
 * Create a keyPair from the mnemonic words
 * @param {*} mnemonic - the mnemonic words
 * @param {*} network - Bitcoin Network
 * TODO: add derivation index from DB
 */
const mnemonicToKeyPair = (mnemonic, network) => {
  const bitcoinnetwork = network.bitcoinjsNetwork
  var seed = MnemonicService.mnemonicToSeed(mnemonic)
  let hdNode = bitcoinjs.HDNode.fromSeedBuffer(seed, bitcoinnetwork)
  let keyPair = hdNode.derivePath(network.derivePath + '/0')
  return keyPair
}

module.exports = {
  newAddress,
  mnemonicToKeyPair
}
