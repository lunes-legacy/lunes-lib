const WAValidator = require('wallet-address-validator')

/**
 *  Check if an address is valid on a network
 *
 * @param {String} address - address to validate
 * @param {String} currency - the currency network - Ex: BTC or ETH
 * @param {String} testnet - if is testnet network
 */
module.exports = (address, currency, testnet) => {
  try {
    return WAValidator.validate(address, currency, testnet ? 'testnet' : 'prod')
  } catch (error) {
    throw error.response ? error.response.data : new Error(error)
  }
}
