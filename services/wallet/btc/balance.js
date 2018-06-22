const sb = require('satoshi-bitcoin')
const ElectrumClient = require('./api/electrumApi')
const errorPattern = require('../../errorPattern')

module.exports = async (address, network) => {
  const electrum = await ElectrumClient(network)
  const balance = await electrum.blockchainAddress_getBalance(address)
  electrum.close();
  
  return {
    status: 'success',
    data: {
      network: network.coinSymbol,
      address: address,
      confirmed_balance: sb.toBitcoin(balance.confirmed).toFixed(8),
      unconfirmed_balance: sb.toBitcoin(balance.unconfirmed).toFixed(8)
    }
  };
}
