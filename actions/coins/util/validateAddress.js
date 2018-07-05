/**
 *  Check if an address is valid on a network
 *
 * @param {String} address - address to validate
 * @param {String} currency - the currency network - Ex: BTC or ETH
 * @param {Boolean} testnet - if is testnet network
 */
module.exports = async (address, currency, testnet) => {
  try {
    const axios = require('axios')
    const endpoint = `${require('../../../constants/api')}/coins/mobile/validate-address`

    const data = {
      address: address,
      currency: currency,
      testnet: testnet
    }

    const result = await axios.post(endpoint, data)
    return result.data
  } catch (error) {
    throw error.response ? error.response.data : new Error(error)
  }
}
