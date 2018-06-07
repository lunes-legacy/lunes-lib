const hdkey = require('ethereumjs-wallet/hdkey')
const MnemonicService = require('../mnemonic')
const EthereumUtil = require('ethereumjs-util')

/**
 * Derive a ethereum address from a mnemonic
 * @param {*} mnemonic - the mnemonic words
 */
const newAddress = mnemonic => {
  const wallet = mnemonicToWallet(mnemonic)
  let ethereumAddress = wallet.getAddress().toString('hex')
  ethereumAddress = EthereumUtil.addHexPrefix(ethereumAddress)
  return ethereumAddress
}

/**
 * Create a ethereum wallet from the mnemonic words
 * @param {*} mnemonic - the mnemonic words
 * TODO: add derivation index from DB
 */
const mnemonicToWallet = mnemonic => {
  const seed = MnemonicService.mnemonicToSeed(mnemonic)
  // Ethereum não diferencia endereços testnet e mainnet
  const path = 'm/44\'/60\'/0\'/0/0'

  const ethKey = hdkey.fromMasterSeed(seed)
  const wallet = ethKey.derivePath(path).getWallet()
  return wallet
}

module.exports = {
  newAddress,
  mnemonicToWallet
}
