const errorPattern = require('../errorPattern')

module.exports = async (address, currency, testnet) => {
  try {
    const axios = require('axios')
    const endpoint = `${require('../../constants/api')}/coins/mobile/validate-address`

    const data = {
      address: address,
      currency: currency,
      testnet: testnet
    }

    const result = await axios.post(endpoint, data)
    return result.data
  } catch (error) {
    throw errorPattern(
      error.message || 'Error validating address',
      error.status || 0,
      error.messageKey || 'VALIDATE_ADDRESS_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
