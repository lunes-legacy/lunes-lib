const BtcNetworks = require('../services/wallet/btc/networks')
const LnsNetworks = require('../services/wallet/lns/networks')

module.exports = {
  BTC: BtcNetworks.BTC,
  BTCTESTNET: BtcNetworks.BTCTESTNET,
  LTC: BtcNetworks.LTC,
  LTCTESTNET: BtcNetworks.LTCTESTNET,
  DASH: BtcNetworks.DASH,
  DASHTESTNET: BtcNetworks.DASHTESTNET,
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
  LNS: LnsNetworks.LNS,
  LNSTESTNET: LnsNetworks.LNSTESTNET
}
