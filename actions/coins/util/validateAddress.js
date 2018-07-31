const WAValidator = require('wallet-address-validator')

/**
 *  Check if an address is valid on a network
 *
 * @param {String} address - address to validate
 * @param {String} currency - the currency network - Ex: BTC or ETH
 * @param {Boolean} testnet - if is testnet network
 */
module.exports = (address, currency, testnet) => {
  try {
    if (currency.search(/(usdt)/i) !== -1)
      currency = 'BTC';
    return WAValidator.validate(address, currency, testnet ? 'testnet' : 'prod')
  } catch (error) {
    throw error.response ? error.response.data : new Error(error)
  }
}
