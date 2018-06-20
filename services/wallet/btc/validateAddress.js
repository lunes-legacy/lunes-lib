const bitcoinjs = require('bitcoinjs-lib')
require('bitcoinjs-testnets').register(bitcoinjs.networks)

module.exports = (address, network) => {
    try {
        bitcoinjs.address.toOutputScript(
            address,
            network.bitcoinjsNetwork
        )
        return true
    } catch (e) {
        return false
    }
}
