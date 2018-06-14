const axios = require('axios')
const errorPattern = require('../../errorPattern')
const validateAddress = require('./validateAddress')

/**
 * Obtain total leased balance of a Lunes coin address
 *
 * @param {String} address - address to find balance
 * @param {LNS} network - Lunes Network
 *
 * @return
 *    network:
      data: {
        leaseBalance:
      }
 */
module.exports = async (address, network) => {
  try {
    const validate = await validateAddress(address, network)
    if (!validate) {
      throw errorPattern(
        'Invalid ' + network.coinName + ' Address',
        0,
        'ADDRESS_INVALID',
        'The address ' +
          address +
          ' is not a valid ' +
          network.coinName +
          ' address.'
      )
    }
    let res = await axios.get(network.apiUrl + '/leasing/active/' + address)
    let activeLeaseBalance = 0
    res.data.map(data => {
      activeLeaseBalance = activeLeaseBalance + data.amount
    })
    return {
      network: network.coinSymbol,
      data: {
        leaseBalance: activeLeaseBalance
      }
    }
  } catch (error) {
    throw errorPattern(
      error.message || 'Error lease balance',
      error.status || 0,
      error.messageKey || 'LEASE_BALANCE_ADDRESS_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
