const axios = require('axios')

const createDepositWalletEndpointBTC = `${require('../../../constants/api')}/deposit/wallet/create/btc`
const createDepositWalletEndpointETH = `${require('../../../constants/api')}/deposit/wallet/create/eth`
const createDepositWalletEndpointLTC = `${require('../../../constants/api')}/deposit/wallet/create/ltc`

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
    const resBTC = await axios.post(createDepositWalletEndpointBTC, {email, testnet}, { headers })
    //const resETH = await axios.post(createDepositWalletEndpointETH, {email, testnet}, { headers })
    //const resLTC = await axios.post(createDepositWalletEndpointLTC, {email, testnet}, { headers })
    return {
      BTC: resBTC.data,
      ETH: null,
      LTC: null
    };
  } catch (err) {
    throw err.response ? err.response.data : new Error(err)
  }
}
