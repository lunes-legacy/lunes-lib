const axios = require('axios')

const createDepositWalletEndpoint = `${require('../../../constants/api')}/deposit/wallet/create`

/**
 *
 * @param {string} email - xxx@domain.com
 * @param {string} accessToken - hash token
 * @param {string} coin - btc, ltc, eth
 * @param {boolean} testnet -  true/false
 */
module.exports = async (email, accessToken, coin, testnet) => {

  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    // 1. create transaction
    const depositResponse = await create(headers, email, coin, testnet)

    return depositResponse
  } catch (err) {
    throw err
  }
}

/**
 * @param {object} headers - { Authorization: 'Bearer jkhjhkhkhkjn' }
 * @param {string} email - xxx@domain.com
 * @param {string} coin - btc, ltc, eth
 * @param {boolean} testnet -  true/false
*/
const create = async (headers, email, coin, testnet) => {
  try {
    const url = `${createDepositWalletEndpoint}/${coin}`
    const res = await axios.post(createDepositWalletEndpoint, {email, testnet}, { headers })
    return res.data
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
