const sb = require('satoshi-bitcoin')
const ElectrumClient = require('./api/electrumApi')
const errorPattern = require('../../errorPattern')

module.exports = async (address, network) => {
  try {
    const electrum = await ElectrumClient(network)
    const balance = await electrum.blockchainAddress_getBalance(address)

    return {
      status: 'success',
      data: {
        network: network.coinSymbol,
        address: address,
        confirmed_balance: sb.toBitcoin(balance.confirmed).toFixed(8),
        unconfirmed_balance: sb.toBitcoin(balance.unconfirmed).toFixed(8)
      }
    };
  } catch (error) {
    throw errorPattern(
      error.message || 'Error retrieving balance',
      error.status || 500,
      error.messageKey || 'BALANCE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
