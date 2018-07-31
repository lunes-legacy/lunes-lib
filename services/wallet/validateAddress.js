const WAValidator = require('wallet-address-validator')
const errorPattern = require('../errorPattern')

module.exports = (address, currency, testnet) => {
  try {
    if (currency.search(/(usdt)/i) !== -1)
      currency = 'BTC';
    currency = currency.replace('TESTNET', '')
    return WAValidator.validate(address, currency, testnet ? 'testnet' : 'prod')
  } catch (error) {
    throw errorPattern(
      error.message || 'Error validating address',
      error.status || 0,
      error.messageKey || 'VALIDATE_ADDRESS_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
