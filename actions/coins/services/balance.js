const validateAddress = require('../util/validateAddress')
const errorPattern = require('../../../services/errorPattern')

module.exports = async (network, address) => {
  try {
    if (network.coinSymbol.toLowerCase() !== 'lns') {
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
    const balance = require('./../../../services/wallet/'+network.coinSymbol.toLowerCase()+'/balance');

    return balance(address, network);
  } catch (error) {
    throw errorPattern(
      error.message || 'Error retrieving balance',
      error.status || 500,
      error.messageKey || 'BALANCE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}