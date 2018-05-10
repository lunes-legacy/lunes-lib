const axios = require('axios')

const endpoint = `${require('../../../constants/api')}/coins/balance`

/**
 * Find balance for an address
 *
 * @param params = {
      {String} address - Address to use
      {String} network - coin network
      {Boolean} testnet - if is testnet network
 * }
 *
 * @return values in coin lowest unit
      network:
      data: {
        address:
        confirmed:
        unconfirmed:
      }
 */
module.exports = async params => {
  let url = `${endpoint}/${params.network}/${params.address}?testnet=${
    params.testnet
  }`
  try {
    const res = await axios.get(url)
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
