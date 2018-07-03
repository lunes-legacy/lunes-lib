const BtcNetworks = require('../services/wallet/btc/networks')
const LnsNetworks = require('../services/wallet/lns/networks')

module.exports = {
  BTC: BtcNetworks.BTC,
  BTCTESTNET: BtcNetworks.BTCTESTNET,
  LTC: BtcNetworks.LTC,
  LTCTESTNET: BtcNetworks.LTCTESTNET,
  DASH: BtcNetworks.DASH,
  DASHTESTNET: BtcNetworks.DASHTESTNET,
  LNS: LnsNetworks.LNS,
  LNSTESTNET: LnsNetworks.LNSTESTNET
}
