const bitcoinjs = require('bitcoinjs-lib')
require('bitcoinjs-testnets').register(bitcoinjs.networks)
const MnemonicService = require('../mnemonic')

/**
 * Derive a bitcoin address from a mnemonic
 * @param {*} mnemonic - the mnemonic words
 * @param {*} coin - coin
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

const teste = (address, network) => {
  let add = bitcoinjs.address.fromOutputScript(
    address,
    network.bitcoinjsNetwork
  )

  return add
}

/**
 * Create a bitcoin keyPair from the mnemonic words
 * @param {*} mnemonic - the mnemonic words
 * @param {*} coin - coin
 * TODO: add derivation index from DB
 */
const mnemonicToKeyPair = (mnemonic, coin) => {
  const network = coin.bitcoinjsNetwork
  var seed = MnemonicService.mnemonicToSeed(mnemonic)
  let hdNode = bitcoinjs.HDNode.fromSeedBuffer(seed, network)
  let keyPair = hdNode.derivePath(coin.derivePath + '/0')
  return keyPair
}

module.exports = {
  newAddress,
  mnemonicToKeyPair
}
