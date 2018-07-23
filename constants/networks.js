const BtcNetworks = require('../services/wallet/btc/networks')
const LnsNetworks = require('../services/wallet/lns/networks')
const EthNetworks = require('../services/wallet/eth/networks')
const TetherNetworks = require('../services/wallet/tether/networks')

module.exports = {
  BTC: BtcNetworks.BTC,
  BTCTESTNET: BtcNetworks.BTCTESTNET,
  BCH: BtcNetworks.BCH,
  BCHTESTNET: BtcNetworks.BCHTESTNET,
  LTC: BtcNetworks.LTC,
  LTCTESTNET: BtcNetworks.LTCTESTNET,
  DASH: BtcNetworks.DASH,
  DASHTESTNET: BtcNetworks.DASHTESTNET,
  ETH: EthNetworks.ETH,
  ROPSTEN: EthNetworks.ROPSTEN,
  LNS: LnsNetworks.LNS,
  LNSTESTNET: LnsNetworks.LNSTESTNET,
  TETHER: TetherNetworks.TETHER,
  TETHERTESTNET: TetherNetworks.TETHERTESTNET
}
