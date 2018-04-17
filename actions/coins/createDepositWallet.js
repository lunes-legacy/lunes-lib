const axios = require('axios')

const createDepositWalletEndpoint = `${require('../../constants/api')}/deposit/wallet/create`

/**
 *
 * @param {string} email - xxx@domain.com
 * @param {string} accessToken - hash token
 * @param {boolean} testnet -  true/false
 */
module.exports = async (email, accessToken, testnet) => {
  const headers = { Authorization: `Bearer ${accessToken}` }
  try {
    // 1. create transaction
    const depositResponse = await create(headers, email, testnet)

    return depositResponse
  } catch (err) {
    throw err
  }
}

/**
 * @param {object} headers - { Authorization: 'Bearer jkhjhkhkhkjn' }
 * @param {string} email - xxx@domain.com
 * @param {boolean} testnet -  true/false
 */
const create = async (headers, email, testnet) => {
  try {
    const res = await axios.post(
      createDepositWalletEndpoint,
      { email, testnet },
      { headers }
    )
    return {
      BTC: res.data.resultBTC,
      ETH: res.data.resultETH,
      LTC: res.data.resultLTC
    }
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
