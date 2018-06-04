const bitcoinjs = require('bitcoinjs-lib')
require('bitcoinjs-testnets').register(bitcoinjs.networks)
const MnemonicService = require('../mnemonic')

/**
 * Derive a bitcoin address from a mnemonic
 * @param {*} mnemonic - the mnemonic words
 * @param {*} coin - coin
 * TODO: segwit or not parameter
 */
const newAddress = (mnemonic, coin) => {
  const keyPair = mnemonicToKeyPair(mnemonic, coin)
  const address = keyPair.getAddress()
  return address
}

/**
 * Create a bitcoin keyPair from the mnemonic words
 * @param {*} mnemonic - the mnemonic words
 * @param {*} coin - coin
 * TODO: add derivation index from DB
 */
const mnemonicToKeyPair = (mnemonic, coin) => {
  const network = coin.bitcoinjsNetwork
  // const seedHex = MnemonicService.mnemonicToSeedHex(mnemonic)
  // const hdNode = bitcoin.HDNode.fromSeedHex(seedHex, network)
  // const keyPair = hdNode.derivePath(coin.derivePath + '/0')

  var seed = MnemonicService.mnemonicToSeed(mnemonic)
  let hdNode = bitcoinjs.HDNode.fromSeedBuffer(seed, network)
  let keyPair = hdNode.derivePath(coin.derivePath + '/0')

  let redeemScript = bitcoinjs.script.witnessPubKeyHash.output.encode(
    bitcoinjs.crypto.hash160(keyPair.getPublicKeyBuffer())
  )
  let scriptPubKey = bitcoinjs.script.scriptHash.output.encode(
    bitcoinjs.crypto.hash160(redeemScript)
  )
  let segwitAddress = bitcoinjs.address.fromOutputScript(scriptPubKey, network)

  return keyPair
}

module.exports = {
  newAddress,
  mnemonicToKeyPair
}
