const axios = require('axios')
const errorPattern = require('../../../services/errorPattern')

const endpoint = `${require('../../../constants/api')}/coins/history`

/**
 * Obtain lease history for Lunes coin for an address.
 *
 * @param params = {
      {String} address - Address to use
      {Boolean} testnet - if is testnet network
 * }
 *
 * @return
      network:
      data: {
        address:
        history: [ type:
                  otherParams: [
                    type:
                    status:
                  ]
                  txid:
                  date:
                  blockHeight:
                  nativeAmount:
                  networkFee:
                ]
      }
 */
module.exports = async params => {
  let url = `${endpoint}/lns/${params.address}?testnet=${params.testnet}`
  try {
    const res = await axios.get(url)

    const leaseHistory = res.data.data.history.filter(val => {
      if (val.otherParams.type === 8 || val.otherParams.type === 9) {
        return val
      }
    })

    return leaseHistory
  } catch (error) {
    if (error.response) {
      const err = error.response.data
      throw errorPattern(
        err.message || 'Error on coins.services.leaseHistory',
        err.status || 0,
        err.messageKey || 'COINS_SERVICE_HISTORY_LEASE_ERROR',
        err.logMessage || err.stack || ''
      )
    }
    throw errorPattern(
      error.message || 'Error on coins.services.leaseHistory',
      error.status || 0,
      error.messageKey || 'COINS_SERVICE_HISTORY_LEASE_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
