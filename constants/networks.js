const BtcNetworks = require('../services/wallet/btc/networks')
const LnsNetworks = require('../services/wallet/lns/networks')

module.exports = {
  BtcNetworks,
  ETH: {
    coinSymbol: 'ETH',
    coinName: 'Ethereum',
    testnet: false,
    defaultFee: 23000
  },
  ROPSTEN: {
    coinSymbol: 'ETH',
    coinName: 'Ethereum Testnet',
    testnet: true,
    defaultFee: 23000
  },
  LnsNetworks
}
