const axios = require('axios')
const errorPattern = require('../../errorPattern')

module.exports = async (address, network) => {
  try {
    let res = await axios.get(network.apiUrl + 'addresses/validate/' + address)
    return res.data.valid
  } catch (error) {
    throw errorPattern(
      error.message || 'Error validating address',
      error.status || 500,
      error.messageKey || 'VALIDATE_ADDRESS_ERROR',
      error.logMessage || error.stack || ''
    )
  }
}
