const WAValidator = require('wallet-address-validator')
const errorPattern = require('../errorPattern')

module.exports = (address, currency, testnet) => {
  try {
    currency = currency.replace('TESTNET', '')
    console.log('VALIDATOR: address, currency, testnet', `${address} / ${currency} / ${testnet}`);
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
