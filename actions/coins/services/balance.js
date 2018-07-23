const validateAddress = require('../util/validateAddress')
const errorPattern = require('../../../services/errorPattern')
const networks = require('../../../constants/networks')

function getNetwork (coin, testnet, object) {
  var network = null

  Object.keys(object).forEach(key => {
    var val = object[key]
    if (typeof val === 'object' && typeof val.coinSymbol === 'undefined') {
      return getNetwork(coin, testnet, val)
    } else {
      if (!network && val.coinSymbol === coin && val.testnet === testnet) {
        network = val
      }
    }
  })

  return network
}

module.exports = async (coin, address, testnet) => {
  try {
    const network = getNetwork(coin.toUpperCase(), testnet, networks)
    if (network.coinSymbol.search(/(lns)|(lunes)/i) !== -1) {
      if (!validateAddress(address, network.coinSymbol, network.testnet)) {
        throw errorPattern(
          'Invalid ' + network.coinName + ' Address',
          406,
          'ADDRESS_INVALID',
          'The address ' +
            address +
            ' is not a valid ' +
            network.coinName +
            ' address.'
        )
      }
    }

    let balance
    if (
      network.coinSymbol === 'BTC' ||
      network.coinSymbol === 'LTC' ||
      network.coinSymbol === 'DASH' ||
      network.coinSymbol === 'BCH'
    ) {
      balance = require('./../../../services/wallet/btc/balance')
    } else if (network.coinSymbol.search(/(usdt)/i) !== -1) {
      balance = require('./../../../services/wallet/usdt/balance');
    } else {
      balance = require('./../../../services/wallet/' +
        network.coinSymbol.toLowerCase() +
        '/balance')
    }
    return balance(address, network)
  } catch (error) {
    throw errorPattern(
      error.message || 'Error retrieving balance',
      error.status || 500,
      error.messageKey || 'BALANCE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
