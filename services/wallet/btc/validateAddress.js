const bitcoinjs = require('bitcoinjs-lib')
require('bitcoinjs-testnets').register(bitcoinjs.networks)
const MnemonicService = require('../mnemonic')

module.exports = (address, network) => {
  return bitcoinjs.address.toOutputScript(
    address,
    network.bitcoinjsNetwork
  )
}
