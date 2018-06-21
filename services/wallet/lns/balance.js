const axios = require('axios')
const validateAddress = require('./validateAddress')
const errorPattern = require('../../errorPattern')

/**
 * Find balance for an address
 *
 * @param {String} address - address to find balance
 * @param {LNS} network - Lunes Network
 *
 * @return values
 *    network:
      data: {
        address:
        confirmed:
        unconfirmed:
      }
 */
module.exports = async (address, network) => {
  try {
    const validate = await validateAddress(address, network)
    if (!validate) {
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

    let res = await axios.get(
      network.apiUrl + '/addresses/balance/details/' + address
    )

    return {
      network: network.coinSymbol,
      data: {
        address: address,
        confirmed: res.data.available,
        unconfirmed: null
      }
    }
  } catch (error) {
    throw errorPattern(
      error.message || 'Error retrieving balances',
      error.status || 500,
      error.messageKey || 'BALANCE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
